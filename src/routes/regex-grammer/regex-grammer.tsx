import { Row, Col, Card, Input } from "antd";
import type { GetProps } from 'antd';
import MarkDownComponent from "../../tools/common/markdown";
import { useState } from "react";
import type { FiniteAutomaton } from "../../components/finite-automaton/finite-automaton";
import { convertDFAToMinDFA } from "../../tools/2/convertDFAToMinDFA";
import { convertNFAToDFA } from "../../tools/2/convertNFAToDFA";
import { convertRegexToNFA } from "../../tools/2/convertRegexToNFA";
import { RegexResult } from "../regex-converter/regex-converter";
import FiniteAutomatonComponent from "../../components/finite-automaton/finite-automaton";

type SearchProps = GetProps<typeof Input.Search>;
const { Search } = Input;

const intro = `任何一个正则表达式 $R$，都可以**自动化地**构造出一个等价的右线性文法（regular grammar），再将其视为 CFG。

* **构造思路**
  1. 将 $R$ 转换为 NFA（Thompson 构造）。
  2. 如果需要，也可从 NFA 转为 DFA（子集构造）。
  3. 对于 DFA 的每个状态 $q_i$，引入文法非终结符 $A_i$。
  4. 对于 DFA 中的转移 $q_i \\xrightarrow{a} q_j$，在文法中加入产生式 $A_i → a A_j$
  5. 对于接受态 $q_f$，加入产生式 $A_f → ε$
* **结果**：得到一个右线性 CFG，且 $L(\\text{CFG})=L(R)$。
`

const example = `教材3.2.1示例: **(a|b)\\*ab**

**第二次作业3**
1. 请写出一个正规式可以产生与下面文法能表示的一样的语言:
    - A → aA|B|ε 
    - B → bB|A 
2. 请写出一个文法可以产生与下面正规式能表示的一样的语言:
    - **(a|c|ba|bc)\\*(b|ε)**
`

function convertMinDfa2Gammer(minDfa: FiniteAutomaton): string {
  const { acceptStates, transitions } = minDfa
  // 建立状态到非终结符的映射
  const nonTerminals: Record<string, string> = {}
  Object.keys(transitions).forEach(state => {
    nonTerminals[state] = state
  })

  // 按 LHS 收集所有 RHS
  const prodMap: Record<string, string[]> = {}
  Object.keys(transitions).forEach(state => {
    prodMap[state] = []
  })

  // 根据转移添加产生式
  Object.entries(transitions).forEach(([state, trans]) => {
    Object.entries(trans).forEach(([symbol, nextStates]) => {
      nextStates.forEach(ns => {
        prodMap[state].push(`$${symbol}A_${nonTerminals[ns]}$`)
      })
    })
  })

  // 接受态添加 ε
  acceptStates.forEach(state => {
    prodMap[state].push('$\\epsilon$')
  })

  // 生成最终文法，每个非终结符一行，RHS 用 " | " 连接
  const lines = Object.keys(prodMap).map(state => {
    const nt = nonTerminals[state]
    const rhss = prodMap[state].join(' | ')
    return `$A_${nt}$ $\\rightarrow$ ${rhss}`
  })

  return lines.join('\n\n')
}

export default function RegexGrammer() {
  const [regexInput, setRegexInput] = useState('');
  const [minDfaResult, setMinDfaResult] = useState<FiniteAutomaton | null>(null);
  const [grammarResult, setGrammarResult] = useState<string | null>(null);

  const onConvert: SearchProps['onSearch'] = (value) => {
    setRegexInput(value);
    const nfa = convertRegexToNFA(value);
    const dfa = convertNFAToDFA(nfa);
    const minDfa = convertDFAToMinDFA(dfa);
    setMinDfaResult(minDfa);
    const grammar = convertMinDfa2Gammer(minDfa);
    setGrammarResult(grammar);
  };

  return (
    <div>
      <Row
        gutter={[16, 16]}
        justify="space-around"
        style={{ marginBottom: 16, alignItems: 'stretch' }}
      >
        <Col xs={24} sm={24} md={12} lg={12} style={{ display: 'flex' }}>
          <Card
            title="正则表达式与上下文无关文法"
            style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
          >
            <MarkDownComponent content={intro} showAnchor={false}></MarkDownComponent>
          </Card>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12} style={{ display: 'flex' }}>
          <Card
            title="输入示例"
            style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
          >
            <MarkDownComponent content={example} showAnchor={false}></MarkDownComponent>
          </Card>
        </Col>
      </Row>
      <Search
        placeholder="请输入需要转换的正规式"
        allowClear
        enterButton="转换"
        size="large"
        onSearch={onConvert}
      />
      {regexInput ? <RegexResult regexInput={regexInput} style={{ marginTop: 16 }} /> : null}
      {regexInput
        ? (
          minDfaResult
            ? <FiniteAutomatonComponent fa={minDfaResult} title="Min-DFA" style={{ marginTop: 16 }} />
            : <Card title="Min-DFA" style={{ marginTop: 16 }}><p>转换失败,请检查输入的正规式是否符合语法要求.</p></Card>
        )
        : null
      }
      {regexInput
        ? (
          grammarResult
            ? <Card title="转换结果" style={{ marginTop: 16 }}><MarkDownComponent content={grammarResult} showAnchor={false}></MarkDownComponent></Card>
            : <Card title="转换结果" style={{ marginTop: 16 }}><p>转换失败,请检查输入的正规式是否符合语法要求.</p></Card>
        )
        : null
      }
    </div>
  )
}