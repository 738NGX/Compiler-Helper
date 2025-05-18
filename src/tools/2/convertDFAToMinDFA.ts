import { FiniteAutomaton } from "../../components/finite-automaton/finite-automaton";

interface Dfa2MinDfaState {
  dfaState: string[];
  minDfaState: string;
  isAccept: boolean;
  transitions: Record<string, string>;
}

function getMinDfaResult(dfa: FiniteAutomaton) {
  const dfaCopy = JSON.parse(JSON.stringify(dfa)) as FiniteAutomaton;
  const symbols = Array.from(new Set(
    Object.values(dfaCopy.transitions).flatMap(tx => Object.keys(tx))
  ));
  const acceptStates = dfaCopy.acceptStates;
  const allStates = Object.keys(dfaCopy.transitions);

  // —— 0. 填补“死胡同”态 —— 
  const trap = '__trap';
  // 如果还没加过，就新建一个空 transitions
  if (!dfaCopy.transitions[trap]) {
    dfaCopy.transitions[trap] = {};
    // trap 对所有符号都自环
    symbols.forEach(sym => {
      dfaCopy.transitions[trap][sym] = [trap];
    });
  }
  // 确保每个原有状态的每个符号都有目标，否则指向 trap
  allStates.forEach(s => {
    symbols.forEach(sym => {
      if (!dfaCopy.transitions[s][sym] || dfaCopy.transitions[s][sym].length === 0) {
        dfaCopy.transitions[s][sym] = [trap];
      }
    });
  });
  // 更新全状态列表
  const statesWithTrap = [...new Set([...allStates, trap])];

  // —— 1. 初始化分区：接受 vs 非接受 —— 
  const acceptSet = new Set(acceptStates);
  const nonAccept = statesWithTrap.filter(s => !acceptSet.has(s));
  let partitions: Set<string>[] = [
    new Set(acceptStates),
    new Set(nonAccept)
  ];

  // —— 2. 细化分区 —— 
  let changed = true;
  while (changed) {
    changed = false;
    for (let i = 0; i < partitions.length; i++) {
      const group = partitions[i];
      const splitter: Record<string, Set<string>> = {};
      for (const state of group) {
        const sig = symbols
          .map(sym => {
            const tgt = dfaCopy.transitions[state][sym][0];
            return partitions.findIndex(p => p.has(tgt));
          })
          .join(',');
        (splitter[sig] ||= new Set()).add(state);
      }
      const pieces = Object.values(splitter);
      if (pieces.length > 1) {
        partitions.splice(i, 1, ...pieces);
        changed = true;
        break;
      }
    }
  }

  // —— 3. 去掉空组 & trap 自身组（既非 C，也无意义展示） —— 
  partitions = partitions
    .filter(p => p.size > 0 && !(p.size === 1 && p.has(trap)));

  // —— 4. 构造结果 —— 
  const dfaResult: Dfa2MinDfaState[] = partitions.map(group => {
    const states = Array.from(group);
    const repr = (partitions.indexOf(group) + 1).toString();  // 用 1,2,… 做名字
    const isAcceptGroup = states.some(s => acceptSet.has(s));
    const trans: Record<string, string> = {};
    symbols.forEach(sym => {
      const tgt = dfaCopy.transitions[states[0]][sym][0];
      const tgtGroupIdx = partitions.findIndex(p => p.has(tgt));
      if (tgtGroupIdx >= 0) {
        trans[sym] = (tgtGroupIdx + 1).toString();
      }
    });
    return {
      dfaState: states,
      minDfaState: repr,
      isAccept: isAcceptGroup,
      transitions: trans
    };
  });

  return { dfaResult, symbols };
}

export function getDfa2MinDfaTransTable(dfa: FiniteAutomaton) {
  const { dfaResult, symbols } = getMinDfaResult(dfa);
  const dataSource = dfaResult.map(item => {
    const { dfaState, minDfaState, isAccept, transitions } = item;
    const row: any = {
      key: minDfaState,
      dfaState: dfaState.join(','),
      minDfaState: minDfaState,
      isAccept: isAccept ? 'accept' : '',
      ...transitions,
    };
    symbols.forEach(sym => {
      row[sym] = transitions[sym] || '-';
    });
    return row;
  }
  );
  const columns = [
    {
      title: 'DFA STATE',
      dataIndex: 'dfaState',
      key: 'dfaState',
      render: (val: string) => val,
    },
    {
      title: 'Min-DFA STATE',
      dataIndex: 'minDfaState',
      key: 'minDfaState',
      render: (val: string) => val,
    },
    {
      title: 'TYPE',
      dataIndex: 'isAccept',
      key: 'isAccept',
      render: (val: string) => val,
    },
    ...symbols.map(sym => ({
      title: sym,
      dataIndex: sym,
      key: sym,
      render: (val: string) => val,
    })),
  ];
  return { dataSource, columns };
}

export function convertDFAToMinDFA(dfa: FiniteAutomaton): FiniteAutomaton {
  const { dfaResult, symbols } = getMinDfaResult(dfa);
  const startState = dfaResult.find(item => item.dfaState.includes(dfa.startState))?.minDfaState || '';
  const acceptStates = dfaResult
    .filter(item => item.isAccept)
    .map(item => item.minDfaState);
  const minDfaTransitions: { [from: string]: { [symbol: string]: string[] } } = {};
  dfaResult.forEach(item => {
    const { minDfaState, transitions } = item;
    minDfaTransitions[minDfaState] = {};
    symbols.forEach(sym => {
      const tgtState = transitions[sym];
      if (tgtState) {
        // directly assign the minimal-state ID
        minDfaTransitions[minDfaState][sym] = [tgtState];
      }
    });
  });

  // 返回最小 DFA
  return new FiniteAutomaton(startState, acceptStates, minDfaTransitions);
}
