import React, { useEffect, useState } from 'react';
import mermaid from 'mermaid';
import { usePrefersColorScheme } from '~/hooks/usePrefersColorScheme';
import { Card } from 'antd';

// Grammar type: nonterminal -> array of productions (each production is array of symbols, 'ε' denotes empty)
export interface Grammar {
  [nonterminal: string]: string[][];
}

type Node = {
  type: string;
  value?: string;
  children?: Node[];
};

// Error Boundary catches rendering/runtime errors
type ErrorBoundaryProps = React.PropsWithChildren<{}>;
type ErrorBoundaryState = { hasError: boolean; error: Error | null };

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error in GenericParserViewer:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Card title="错误" style={{ margin: '1rem 0' }}>
          <p>组件渲染出错：{this.state.error?.message}</p>
        </Card>
      );
    }
    return <>{this.props.children}</>;
  }
}

class GrammarParser {
  private tokens: string[];
  private pos: number = 0;
  public derivation: string[] = [];
  private grammar: Grammar;
  private start: string;

  constructor(tokens: string[], grammar: Grammar, start: string) {
    this.tokens = tokens;
    this.grammar = grammar;
    this.start = start;
    this.derivation.push(start);
  }

  private log(step: string) {
    this.derivation.push(step);
  }

  parseSymbol(sym: string): Node | null {
    if (!(sym in this.grammar)) {
      if (this.tokens[this.pos] === sym) {
        const node: Node = { type: sym, value: sym };
        this.pos++;
        return node;
      }
      return null;
    }
    const prods = this.grammar[sym];
    const nonRec = prods.filter(p => p[0] !== sym);
    const recs = prods.filter(p => p[0] === sym).map(p => p.slice(1));
    for (const prod of nonRec) {
      const savePos = this.pos;
      this.log(`${sym} → ${prod.join(' ') || 'ε'}`);
      const children: Node[] = [];
      let ok = true;
      for (const tok of prod) {
        if (tok === 'ε') continue;
        const child = this.parseSymbol(tok);
        if (!child) { ok = false; break; }
        children.push(child);
      }
      if (!ok) {
        this.pos = savePos;
        this.derivation.pop();
        continue;
      }
      let leftNode: Node = { type: sym, children: children.length ? children : undefined };
      let extended = true;
      while (extended) {
        extended = false;
        for (const alpha of recs) {
          const pos1 = this.pos;
          this.log(`${sym} → ${sym} ${alpha.join(' ')}`);
          const tail: Node[] = [];
          let ok2 = true;
          for (const tok of alpha) {
            if (tok === 'ε') continue;
            const c = this.parseSymbol(tok);
            if (!c) { ok2 = false; break; }
            tail.push(c);
          }
          if (!ok2) {
            this.pos = pos1;
            this.derivation.pop();
            continue;
          }
          leftNode = { type: sym, children: [leftNode, ...tail] };
          extended = true;
          break;
        }
      }
      return leftNode;
    }
    return null;
  }

  run(): { ast: Node; derivation: string[] } {
    const ast = this.parseSymbol(this.start);
    if (!ast || this.pos < this.tokens.length) {
      throw new Error(`Parse error at token index ${this.pos}`);
    }
    return { ast, derivation: this.derivation };
  }
}

function tokenize(input: string, terminals: string[]): string[] {
  const sorted = [...terminals].sort((a, b) => b.length - a.length);
  const tokens: string[] = [];
  let i = 0;
  while (i < input.length) {
    if (/\s/.test(input[i])) { i++; continue; }
    let matched = false;
    for (const term of sorted) {
      if (input.startsWith(term, i)) {
        tokens.push(term);
        i += term.length;
        matched = true;
        break;
      }
    }
    if (!matched) throw new Error(`Unknown symbol at position ${i}`);
  }
  return tokens;
}

function astToMermaid(node: Node, id = 0, lines: string[] = []): [string[], number] {
  const label = node.value ? `${node.type}: ${node.value}` : node.type;
  lines.push(`node${id}[\"${label}\"]`);
  let next = id + 1;
  node.children?.forEach(child => {
    const [_, newNext] = astToMermaid(child, next, lines);
    lines.push(`node${id} --> node${next}`);
    next = newNext;
  });
  return [lines, next];
}

function stringifyGrammar(grammar: Grammar): string {
  return Object.entries(grammar)
    .map(([nonterminal, productions]) => `${nonterminal} -> ${productions.map(p => p.join(' ')).join(' | ')}`)
    .join('\n');
}

export default function GenericParserViewer({ expr, grammar, startSymbol }: { expr: string; grammar: Grammar; startSymbol: string }) {
  const [derivation, setDerivation] = useState<string[]>([]);
  const [diagram, setDiagram] = useState('');
  const [svg, setSvg] = useState('');
  const [error, setError] = useState<Error | null>(null);
  const scheme = usePrefersColorScheme() === 'dark' ? 'dark' : 'default';

  useEffect(() => {
    try {
      setError(null);
      const nonTerms = new Set(Object.keys(grammar));
      const terms = new Set<string>();
      Object.values(grammar).flat().flat().forEach(sym => {
        if (!nonTerms.has(sym) && sym !== 'ε') terms.add(sym);
      });
      const tokens = tokenize(expr, Array.from(terms));
      const parser = new GrammarParser(tokens, grammar, startSymbol);
      const { ast } = parser.run();
      const forms: string[][] = [[startSymbol]];
      (function traverse(node: Node) {
        if (!node.children) return;
        const lastForm = forms[forms.length - 1];
        const idx = lastForm.findIndex(sym => sym === node.type);
        if (idx >= 0) {
          const replacement = node.children.map(child => child.type);
          forms.push([...lastForm.slice(0, idx), ...replacement, ...lastForm.slice(idx + 1)]);
        }
        node.children.forEach(traverse);
      })(ast);
      setDerivation(forms.map(f => f.join(' ')));
      const [lines] = astToMermaid(ast, 0, []);
      setDiagram(['graph TB', ...lines].join('\n'));
    } catch (err: any) {
      setError(err);
    }
  }, [expr, grammar, startSymbol]);

  useEffect(() => {
    if (error) return;
    mermaid.initialize({ startOnLoad: false, theme: scheme });
    if (!diagram) return;
    const id = `g${Math.random().toString(36).slice(2)}`;
    mermaid.render(id, diagram)
      .then(({ svg }) => setSvg(svg))
      .catch(err => setError(err));
  }, [diagram, scheme, error]);

  if (error) {
    return (
      <Card title="错误" style={{ margin: '1rem 0' }}>
        <p>解析或渲染出错：{error.message}</p>
      </Card>
    );
  }

  return (
    <ErrorBoundary>
      <div className="mt-4 mb-4">
        <Card className="min-w-[300px]" title="输入信息">
          <p style={{ whiteSpace: 'pre-wrap' }}>输入文法:<b>{'\n' + stringifyGrammar(grammar)}</b></p>
          <p>开始符号: <b>{startSymbol}</b></p>
          <p>目标表达式: <b>{expr}</b></p>
        </Card>
        <div className="mt-4 mb-4">
          <Card className="min-w-[300px]" title="最左推导">
            <ol className="ml-4">
              {derivation.map((step, i) => (
                <li key={i}>{'=>'}{step}</li>
              ))}
            </ol>
          </Card>
        </div>
        <Card className="min-w-[300px]" title="分析树">
          <div dangerouslySetInnerHTML={{ __html: svg }} />
        </Card>
      </div>
    </ErrorBoundary>
  );
}
