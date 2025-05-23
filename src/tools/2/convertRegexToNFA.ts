import { FiniteAutomaton } from "../../components/finite-automaton/finite-automaton";

/**
 * 使用汤普森构造法将正则表达式转换为 NFA
 * 支持操作符：| (并), . (连接), * (闭包)
 * 隐式连接会被插入 '.'
 */
export function convertRegexToNFA(regex: string): FiniteAutomaton {
  const EPSILON = 'ε';
  let stateCounter = 0;
  const newState = () => {
    const num = stateCounter++;
    return `s${num < 10 ? '0' + num : num}`;
  };

  const isOperand = (token: string) => /[a-zA-Z0-9ε]/.test(token);

  // 插入显式连接符：不在 '*'、'+'、'?' 后面插入 '·'
  const insertConcat = (re: string) => {
    let output = '';
    for (let i = 0; i < re.length; i++) {
      const c1 = re[i];
      const c2 = re[i + 1];
      output += c1;
      if (
        c2 &&
        c1 !== '(' &&
        c1 !== '|' &&
        c2 !== ')' &&
        c2 !== '|' &&
        c2 !== '*' &&
        c2 !== '+' &&
        c2 !== '?'
      ) {
        output += '.';
      }
    }
    return output;
  };

  // 中缀转后缀：加上 '+' 和 '?'，优先级与 '*' 同级
  const toPostfix = (infix: string) => {
    const precedence: Record<string, number> = {
      '|': 1,
      '.': 2,
      '*': 3,
      '+': 3,
      '?': 3
    };
    const output: string[] = [];
    const stack: string[] = [];

    for (const token of infix) {
      if (isOperand(token)) {
        output.push(token);
      } else if (token === '(') {
        stack.push(token);
      } else if (token === ')') {
        while (stack.length && stack[stack.length - 1] !== '(') {
          output.push(stack.pop()!);
        }
        stack.pop();
      } else {
        while (
          stack.length &&
          stack[stack.length - 1] !== '(' &&
          precedence[stack[stack.length - 1]] >= precedence[token]
        ) {
          output.push(stack.pop()!);
        }
        stack.push(token);
      }
    }
    while (stack.length) output.push(stack.pop()!);
    return output;
  };

  interface Fragment {
    start: string;
    accept: string;
    transitions: { [from: string]: { [symbol: string]: string[] } };
  }
  const makeFrag = (start: string, accept: string): Fragment => ({
    start, accept, transitions: {}
  });
  const addTransition = (
    trans: Fragment['transitions'],
    from: string,
    symbol: string,
    to: string
  ) => {
    if (!trans[from]) trans[from] = {};
    if (!trans[from][symbol]) trans[from][symbol] = [];
    trans[from][symbol].push(to);
  };

  const mergeConcat = (f1: Fragment, f2: Fragment): Fragment => {
    const merged: Fragment = {
      start: f1.start,
      accept: f2.accept,
      transitions: { ...f1.transitions }
    };
    Object.entries(f2.transitions).forEach(([oldFrom, map]) => {
      const from = oldFrom === f2.start ? f1.accept : oldFrom;
      if (!merged.transitions[from]) merged.transitions[from] = {};
      Object.entries(map).forEach(([sym, tos]) => {
        if (!merged.transitions[from][sym]) merged.transitions[from][sym] = [];
        tos.forEach(to => {
          merged.transitions[from][sym].push(to === f2.start ? f1.accept : to);
        });
      });
    });
    return merged;
  };

  // 正式开始：生成后缀表达式并构造 NFA 片段
  const postfix = toPostfix(insertConcat(regex));
  const stack: Fragment[] = [];

  postfix.forEach(token => {
    if (isOperand(token)) {
      // 普通字符或 ε
      const start = newState(), accept = newState();
      const frag = makeFrag(start, accept);
      addTransition(frag.transitions, start, token === EPSILON ? EPSILON : token, accept);
      stack.push(frag);

    } else if (token === '.') {
      const f2 = stack.pop()!, f1 = stack.pop()!;
      stack.push(mergeConcat(f1, f2));

    } else if (token === '|') {
      const f2 = stack.pop()!, f1 = stack.pop()!;
      const start = newState(), accept = newState();
      const frag = makeFrag(start, accept);
      addTransition(frag.transitions, start, EPSILON, f1.start);
      addTransition(frag.transitions, start, EPSILON, f2.start);
      addTransition(frag.transitions, f1.accept, EPSILON, accept);
      addTransition(frag.transitions, f2.accept, EPSILON, accept);
      [f1, f2].forEach(sub =>
        Object.entries(sub.transitions).forEach(([from, map]) => {
          if (!frag.transitions[from]) frag.transitions[from] = {};
          Object.entries(map).forEach(([sym, tos]) => {
            if (!frag.transitions[from][sym]) frag.transitions[from][sym] = [];
            frag.transitions[from][sym].push(...tos);
          });
        })
      );
      stack.push(frag);

    } else if (token === '*') {
      const f1 = stack.pop()!;
      const start = newState(), accept = newState();
      const frag = makeFrag(start, accept);
      // 0 次或多次
      addTransition(frag.transitions, start, EPSILON, f1.start);
      addTransition(frag.transitions, start, EPSILON, accept);
      addTransition(frag.transitions, f1.accept, EPSILON, f1.start);
      addTransition(frag.transitions, f1.accept, EPSILON, accept);
      Object.entries(f1.transitions).forEach(([from, map]) => {
        if (!frag.transitions[from]) frag.transitions[from] = {};
        Object.entries(map).forEach(([sym, tos]) => {
          if (!frag.transitions[from][sym]) frag.transitions[from][sym] = [];
          frag.transitions[from][sym].push(...tos);
        });
      });
      stack.push(frag);

    } else if (token === '+') {
      const f1 = stack.pop()!;
      const start = newState(), accept = newState();
      const frag = makeFrag(start, accept);
      // 至少一次：类似 *，但去掉初始直接跳到 accept 的 ε
      addTransition(frag.transitions, start, EPSILON, f1.start);
      addTransition(frag.transitions, f1.accept, EPSILON, f1.start);
      addTransition(frag.transitions, f1.accept, EPSILON, accept);
      Object.entries(f1.transitions).forEach(([from, map]) => {
        if (!frag.transitions[from]) frag.transitions[from] = {};
        Object.entries(map).forEach(([sym, tos]) => {
          if (!frag.transitions[from][sym]) frag.transitions[from][sym] = [];
          frag.transitions[from][sym].push(...tos);
        });
      });
      stack.push(frag);

    } else if (token === '?') {
      const f1 = stack.pop()!;
      const start = newState(), accept = newState();
      const frag = makeFrag(start, accept);
      // 零次或一次
      addTransition(frag.transitions, start, EPSILON, f1.start);
      addTransition(frag.transitions, start, EPSILON, accept);
      addTransition(frag.transitions, f1.accept, EPSILON, accept);
      Object.entries(f1.transitions).forEach(([from, map]) => {
        if (!frag.transitions[from]) frag.transitions[from] = {};
        Object.entries(map).forEach(([sym, tos]) => {
          if (!frag.transitions[from][sym]) frag.transitions[from][sym] = [];
          frag.transitions[from][sym].push(...tos);
        });
      });
      stack.push(frag);
    }
  });

  // BFS 重新编号，保证状态 s0, s1, … 按拓扑顺序
  const renumber = (
    start: string,
    accepts: string[],
    trans: { [from: string]: { [symbol: string]: string[] } }
  ) => {
    const queue = [start];
    const visited = new Set([start]);
    const order: string[] = [];
    while (queue.length) {
      const u = queue.shift()!;
      order.push(u);
      Object.values(trans[u] || {})
        .flat()
        .forEach(v => {
          if (!visited.has(v)) {
            visited.add(v);
            queue.push(v);
          }
        });
    }
    const nameMap: Record<string, string> = {};
    order.forEach((old, i) => {
      nameMap[old] = `s${i < 10 ? '0' + i : i}`;
    });
    const newTrans: typeof trans = {};
    Object.entries(trans).forEach(([oldFrom, map]) => {
      const from = nameMap[oldFrom];
      newTrans[from] = {};
      Object.entries(map).forEach(([sym, tos]) => {
        newTrans[from][sym] = tos.map(to => nameMap[to]);
      });
    });
    return {
      start: nameMap[start],
      accepts: accepts.map(a => nameMap[a]),
      transitions: newTrans
    };
  };

  const finalFrag = stack.pop()!;
  const { start: newStart, accepts: newAccepts, transitions: newTrans } =
    renumber(finalFrag.start, [finalFrag.accept], finalFrag.transitions);

  return new FiniteAutomaton(newStart, newAccepts, newTrans);
}
