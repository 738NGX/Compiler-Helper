// src/components/finite-automaton/finite-automaton.tsx
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { Card } from 'antd';
import { ThemeContext } from '../../App';

export class FiniteAutomaton {
  startState: string;
  acceptStates: string[];
  transitions: { [key: string]: { [key: string]: string[] } };
  symbols: string[];

  constructor(
    startState: string,
    acceptStates: string[],
    transitions: { [key: string]: { [key: string]: string[] } }
  ) {
    this.startState = startState;
    this.acceptStates = acceptStates;
    this.transitions = transitions;
    this.symbols = Array.from(
      new Set(
        Object.values(transitions)
          .flatMap(state => Object.keys(state))
          .filter(sym => sym !== 'ε')
      )
    ).sort();
  }

  calculateEpsilonClosure(states: string[]): string[] {
    const closure: Set<string> = new Set();
    const stack: string[] = [...states];

    while (stack.length > 0) {
      const currentState = stack.pop()!;
      if (!closure.has(currentState)) {
        closure.add(currentState);

        const epsilonTransitions = this.transitions[currentState]?.['ε'] || [];
        for (const nextState of epsilonTransitions) {
          if (!closure.has(nextState)) {
            stack.push(nextState);
          }
        }
      }
    }

    return Array.from(closure).sort();
  }
}

export interface FiniteAutomatonComponentProps {
  fa: FiniteAutomaton;
  title?: string;
  style?: React.CSSProperties;
}

// 全局初始化一次
mermaid.initialize({ startOnLoad: false });

export default function FiniteAutomatonComponent({
  fa,
  title,
  style
}: FiniteAutomatonComponentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { dark: isDark } = useContext(ThemeContext);
  const [svg, setSvg] = useState<string>('');

  const definition = useMemo(() => {
    // 收集所有状态
    const states = new Set<string>([fa.startState, ...fa.acceptStates]);
    Object.keys(fa.transitions).forEach(s => states.add(s));
    Object.values(fa.transitions).forEach(map =>
      Object.values(map).forEach(arr => arr.forEach(s => states.add(s)))
    );

    // 合并相同 from->to 的符号
    const edges: Record<string, string[]> = {};
    Object.entries(fa.transitions).forEach(([from, map]) => {
      Object.entries(map).forEach(([sym, tos]) => {
        tos.forEach(to => {
          const key = `${from}->${to}`;
          if (!edges[key]) edges[key] = [];
          edges[key].push(sym);
        });
      });
    });

    let d = isDark ? `%%{init: { 'theme': 'dark' }}%%\n` : '';
    d += 'flowchart LR\n';

    // 节点定义
    states.forEach(s => {
      if (fa.acceptStates.includes(s)) {
        d += `  ${s}((( ${s} )))\n`;
      } else {
        d += `  ${s}(( ${s} ))\n`;
      }
    });

    // 起始箭头
    d += `  start[[start]] --> ${fa.startState}\n`;

    // 边定义，带逗号分隔的标签
    Object.entries(edges).forEach(([key, syms]) => {
      const [from, to] = key.split('->');
      d += `  ${from} -->|${syms.join(',')}| ${to}\n`;
    });

    return d;
  }, [fa, isDark]);

  useEffect(() => {
    const graphId = `fa-${Math.random().toString(36).slice(2)}`;
    mermaid
      .render(graphId, definition)
      .then(({ svg: newSvg }) => setSvg(newSvg))
      .catch(err => console.error('Mermaid 渲染失败：', err));
  }, [definition, isDark]);

  return (
    <div style={{ ...style }}>
      {title ? (
        <Card className="min-w-[300px]" title={title}>
          <div
            ref={containerRef}
            className="fa-diagram"
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        </Card>
      ) : (
        <div
          ref={containerRef}
          className="fa-diagram"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      )}
    </div>
  );
}
