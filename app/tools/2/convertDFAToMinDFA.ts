import { FiniteAutomaton } from "~/components/finite-automaton/finite-automaton";

interface Dfa2MinDfaState {
  dfaState: string[];
  minDfaState: string;
  isAccept: boolean;
  transitions: Record<string, string>;
}

function getMinDfaResult(dfa: FiniteAutomaton) {
  const dfaResult: Dfa2MinDfaState[] = [];
  const symbols = Object.keys(dfa.transitions[Object.keys(dfa.transitions)[0]]);
  const startState = dfa.startState;
  const acceptStates = dfa.acceptStates;

  // 初始化 DFA 状态
  const initialDfaState: Dfa2MinDfaState = {
    dfaState: [startState],
    minDfaState: startState,
    isAccept: acceptStates.includes(startState),
    transitions: {}
  };
  dfaResult.push(initialDfaState);

  // 用于存储已处理的状态组合
  const processedStates = new Set<string>();
  processedStates.add(initialDfaState.dfaState.join(','));

  while (dfaResult.length > 0) {
    const current = dfaResult.shift()!;
    const currentStates = current.dfaState;

    symbols.forEach(sym => {
      const nextStatesSet = new Set<string>();

      currentStates.forEach(state => {
        const nextStates = dfa.transitions[state][sym] || [];
        nextStates.forEach(nextState => nextStatesSet.add(nextState));
      });

      const nextStates = Array.from(nextStatesSet).sort();
      if (nextStates.length === 0) return;

      // 将状态组合转换为字符串以便于存储
      const nextStatesKey = nextStates.join(',');
      if (processedStates.has(nextStatesKey)) return;

      processedStates.add(nextStatesKey);

      let nextDfa: Dfa2MinDfaState | undefined;
      for (const item of dfaResult) {
        if (item.dfaState.join(',') === nextStatesKey) {
          nextDfa = item;
          break;
        }
      }

      if (!nextDfa) {
        nextDfa = {
          dfaState: nextStates,
          minDfaState: nextStates.join(','),
          isAccept: acceptStates.some(state => nextStates.includes(state)),
          transitions: {}
        };
        dfaResult.push(nextDfa);
      }

      current.transitions[sym] = nextDfa.minDfaState;
    });
  }
  console.log('dfaResult', dfaResult);
  return { dfaResult, symbols };
}

export function getDfa2MinDfaTransTable(dfa: FiniteAutomaton) {
  const { dfaResult, symbols } = getMinDfaResult(dfa);
  const dataSource = dfaResult.map(item => {
    const { dfaState, minDfaState, isAccept, transitions } = item;
    const row: any = {
      key: minDfaState,
      isAccept: isAccept ? 'accept' : 'not accept',
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
      title: 'STATE',
      dataIndex: 'minDfaState',
      key: 'minDfaState',
      render: (val: string) => val,
    },
    {
      title: 'isAccept',
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
  const startState = dfa.startState;
  const acceptStates = dfa.acceptStates;

  // 创建最小 DFA 的转换表
  const minDfaTransitions: { [key: string]: { [key: string]: string[]; }; } = {};
  dfaResult.forEach(item => {
    const minDfaState = item.minDfaState;
    minDfaTransitions[minDfaState] = {};
    symbols.forEach(sym => {
      const nextState = item.transitions[sym];
      if (nextState) {
        minDfaTransitions[minDfaState][sym] = [nextState];
      }
    });
  });

  // 返回最小 DFA
  return new FiniteAutomaton(startState, acceptStates, minDfaTransitions);
}
