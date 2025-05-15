// src/components/finite-automaton/finite-automaton.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { Card } from 'antd';
import { usePrefersColorScheme } from '../../hooks/usePrefersColorScheme';

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

interface FiniteAutomatonComponentProps {
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
  const scheme = usePrefersColorScheme()?.toString() === 'dark' ? 'dark' : 'default';

  // 我们用 state 去承载最终的 SVG，React 会在第一次就把它刷到页面上
  const [svg, setSvg] = useState<string>('');

  // 把 flowchart 定义拼好，每当 fa 或 theme 变了就重新生成
  const definition = useMemo(() => {
    const states = new Set<string>([
      fa.startState,
      ...fa.acceptStates,
      ...Object.keys(fa.transitions)
    ]);
    Object.values(fa.transitions).forEach(m =>
      Object.values(m).forEach(arr => arr.forEach(s => states.add(s)))
    );

    let d = '';
    if (scheme === 'dark') {
      d += `%%{init: { 'theme': 'dark' }}%%\n`;
    }
    d += 'flowchart LR\n';
    states.forEach(s => {
      if (fa.acceptStates.includes(s)) {
        d += `  ${s}((( ${s} )))\n`;
      } else {
        d += `  ${s}(( ${s} ))\n`;
      }
    });
    d += `  start[[start]] --> ${fa.startState}\n`;
    Object.entries(fa.transitions).forEach(([from, map]) =>
      Object.entries(map).forEach(([sym, tos]) =>
        tos.forEach(to => {
          d += `  ${from} -->|${sym}| ${to}\n`;
        })
      )
    );
    return d;
  }, [fa, scheme]);

  useEffect(() => {
    mermaid.initialize({ startOnLoad: false, theme: scheme });
    const graphId = `fa-${Math.random().toString(36).slice(2)}`;
    mermaid
      .render(graphId, definition)
      .then(({ svg: newSvg }) => {
        setSvg(newSvg);
      })
      .catch(err => {
        console.error('Mermaid 渲染失败：', err);
      });
  }, [definition, scheme]);

  return (
    <div style={{ ...style }}>
      {
        title
          ? <Card className="min-w-[300px]" title={title}>
            <div
              ref={containerRef}
              className="fa-diagram"
              dangerouslySetInnerHTML={{ __html: svg }}
            />
          </Card>
          : <div
            ref={containerRef}
            className="fa-diagram"
            dangerouslySetInnerHTML={{ __html: svg }}
          />
      }
    </div>
  );
}
