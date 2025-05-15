import { FiniteAutomaton } from "../../components/finite-automaton/finite-automaton";
import type { ColumnsType } from 'antd/lib/table';

interface Nfa2DfaState {
  nfaStates: string[];
  dfaState: string;
  isAccept: boolean;
  transitions: Record<string, string>;
}

function getDfaResult(nfa: FiniteAutomaton) {
  const dfaResult: Nfa2DfaState[] = [];
  const symbols = nfa.symbols;

  // helper to turn an NFA‐set into a unique key
  const stateKey = (states: string[]) => states.join(',');
  const keyToDfaState = new Map<string, string>();
  let dfaStateCount = 0;

  // initialize start
  const startStates = nfa.calculateEpsilonClosure([nfa.startState]);
  const startKey = stateKey(startStates);
  const startDfa = String.fromCharCode(65 + dfaStateCount); // 'A'
  keyToDfaState.set(startKey, startDfa);

  const queue: Nfa2DfaState[] = [{
    nfaStates: startStates,
    dfaState: startDfa,
    isAccept: startStates.some(s => nfa.acceptStates.includes(s)),
    transitions: {}
  }];

  while (queue.length) {
    const current = queue.shift()!;
    const { nfaStates } = current;
    const trans: Record<string, string[]> = {};

    // gather raw transitions
    nfaStates.forEach(state => {
      Object.entries(nfa.transitions[state] || {}).forEach(([sym, tos]) => {
        if (!trans[sym]) trans[sym] = [];
        trans[sym].push(...tos);
      });
    });

    // for each symbol, compute closure and assign/reuse DFA name
    symbols.forEach(sym => {
      const nextStates = nfa.calculateEpsilonClosure(trans[sym] || []);
      if (!nextStates.length) return;

      const nextKey = stateKey(nextStates);
      let nextDfa = keyToDfaState.get(nextKey);

      if (!nextDfa) {
        dfaStateCount++;
        nextDfa = String.fromCharCode(65 + dfaStateCount);
        keyToDfaState.set(nextKey, nextDfa);
        queue.push({
          nfaStates: nextStates,
          dfaState: nextDfa,
          isAccept: nextStates.some(s => nfa.acceptStates.includes(s)),
          transitions: {}
        });
      }

      current.transitions[sym] = nextDfa;
    });

    dfaResult.push(current);
  }

  return { dfaResult, symbols };
}

export function getNfa2DfaTransTable(nfa: FiniteAutomaton) {
  const { dfaResult, symbols } = getDfaResult(nfa);
  const dataSource = dfaResult.map(item => {
    // 把 NFA 状态集拼成 "{0,1}" 的字符串
    const nfaText = `{${item.nfaStates.join(',')}}`;
    // 基础字段
    const row: Record<string, any> = {
      key: item.dfaState,
      nfaStates: nfaText,
      dfaState: item.dfaState,
      type: item.isAccept ? 'accept' : '',
    };
    // 将每个符号也挂到这一行上，没映射到时显示空字符串
    symbols.forEach(sym => {
      row[sym] = item.transitions[sym] || '';
    });
    return row;
  });
  const columns: ColumnsType<Record<string, any>> = [
    {
      title: 'NFA STATE',
      dataIndex: 'nfaStates',
      key: 'nfaStates',
    },
    {
      title: 'DFA STATE',
      dataIndex: 'dfaState',
      key: 'dfaState',
    },
    {
      title: 'TYPE',
      dataIndex: 'type',
      key: 'type',
    },
    ...symbols.map(sym => ({
      title: sym,
      dataIndex: sym,
      key: sym,
      render: (val: string) => (val || '-'),
    })),
  ];
  return { dataSource, columns };
}

export function convertNFAToDFA(nfa: FiniteAutomaton) {
  const { dfaResult } = getDfaResult(nfa);
  const startState = dfaResult[0].dfaState;
  const acceptStates = dfaResult.filter(item => item.isAccept).map(item => item.dfaState);
  const transitions: { [key: string]: { [key: string]: string[]; }; } = {};
  dfaResult.forEach(item => {
    const { dfaState, transitions: itemTransitions } = item;
    transitions[dfaState] = {};
    Object.entries(itemTransitions).forEach(([sym, to]) => {
      if (!transitions[dfaState][sym]) {
        transitions[dfaState][sym] = [];
      }
      transitions[dfaState][sym].push(to);
    });
  });

  return new FiniteAutomaton(startState, acceptStates, transitions);
}
