import { FiniteAutomaton } from "~/components/finite-automaton/finite-automaton";

interface Dfa2MinDfaState {
  dfaState: string[];
  minDfaState: string;
  isAccept: boolean;
  transitions: Record<string, string>;
}

function getMinDfaResult(dfa: FiniteAutomaton) {
  const symbols = Object.keys(dfa.transitions[Object.keys(dfa.transitions)[0]]);
  const acceptStates = dfa.acceptStates;
  // 初始化状态划分：终态和非终态
  const allStates = Object.keys(dfa.transitions);
  let partitions: Set<string>[] = [
    new Set(acceptStates),
    new Set(allStates.filter(s => !acceptStates.includes(s)))
  ];

  // 不断细化划分
  let changed = true;
  while (changed) {
    changed = false;
    for (let i = 0; i < partitions.length; i++) {
      const group = partitions[i];
      const splitter: Record<string, Set<string>> = {};
      // 用转移 signature 做分割
      for (const state of group) {
        const sig = symbols
          .map(sym => {
            const tgt = dfa.transitions[state][sym][0];
            // 找到目标状态所属的分区编号
            return partitions.findIndex(p => p.has(tgt));
          })
          .join(',');
        splitter[sig] = splitter[sig] || new Set();
        splitter[sig].add(state);
      }
      const pieces = Object.values(splitter);
      if (pieces.length > 1) {
        // 替换当前分区
        partitions.splice(i, 1, ...pieces);
        changed = true;
        break;
      }
    }
  }

  // 构造最小化结果
  const dfaResult: Dfa2MinDfaState[] = partitions.map(group => {
    const states = Array.from(group);
    const repr = Array.from(group).join(',');
    const isAcceptGroup = states.some(s => acceptStates.includes(s));
    const trans: Record<string, string> = {};
    symbols.forEach(sym => {
      const tgt = dfa.transitions[states[0]][sym][0];
      const tgtGroup = partitions.find(p => p.has(tgt));
      if (tgtGroup) trans[sym] = Array.from(tgtGroup).join(',');
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
