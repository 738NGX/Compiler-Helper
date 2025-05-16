import { Card, Col, Collapse, Row, type GetProps } from "antd";
import { useState } from "react";
import GenericParserViewer, { type Grammar } from "../../components/generic-parser-viewer/generic-parser-viewer";
import { Input } from 'antd';

const { TextArea } = Input;
type SearchProps = GetProps<typeof Input.Search>;
const { Search } = Input;

function parseGrammar(input: string): Grammar | null {
  const lines = input
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
  const grammar: Grammar = {}

  for (const line of lines) {
    const parts = line.split('->')
    if (parts.length !== 2) {
      // 必须有且只有一个 '->'
      return null
    }

    const lhs = parts[0].trim()
    const rhs = parts[1].trim()

    if (!lhs || !rhs) {
      // 左部或右部不能为空
      return null
    }
    if (grammar[lhs]) {
      // 不允许重复定义同一个非终结符
      return null
    }

    const prods: string[][] = []
    for (const prod of rhs.split('|')) {
      const symbols = prod.trim().split(/\s+/)
      // 每个产生式至少要有一个符号（可以是 ε）
      if (symbols.length === 0 || symbols.some(s => s === '')) {
        return null
      }
      prods.push(symbols)
    }

    grammar[lhs] = prods
  }

  return grammar
}

const example_1 = `假定文法如下:
exp -> exp addop term | term
addop -> + | -
term -> term mulop factor | factor
mulop -> *
factor -> ( exp ) | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
写出下面表达式的最左推导和分析树:
(1) 3+4*5-6
(2) 3*(4-5+6)
(3) 3-(4+5*6)
`
const example_2 = `假定文法如下:
statement -> if-stmt | other | ε
if-stmt -> if ( exp ) statement else-part
else-part -> else statement | ε
exp -> 0 | 1
(a) 画出句子“if(0) if (1) other else else other”相应的分析树
(b) 解释(a)中两个else的意义?
`

export default function LeftMostDerivation() {
  const [expr, setExpr] = useState("");
  const [grammerStr, setGrammerStr] = useState("");
  const [grammar, setGrammar] = useState<Grammar | null>(null);
  const [startSymbol, setStartSymbol] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [correct, setCorrect] = useState(true);

  const onGrammerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setShowResult(false);
    const value = e.target.value;
    setGrammerStr(value);
  }

  const onStartSymbolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowResult(false);
    const value = e.target.value;
    setStartSymbol(value);
  }

  const onParse: SearchProps['onSearch'] = (value) => {
    setShowResult(true)
    const parsedGrammar = parseGrammar(grammerStr);
    if (!parsedGrammar) {
      setCorrect(false);
      return;
    }
    setGrammar(parsedGrammar);
    if (!parsedGrammar[startSymbol]) {
      // startSymbol 不在文法中
      setCorrect(false)
      return
    }
    setCorrect(true)
    setExpr(value)
  };

  return (
    <div>
      <Row
        gutter={[16, 16]}
        justify="space-around"
        style={{ marginBottom: 16, alignItems: 'stretch' }}
      >
        <Col xs={24} sm={24} md={7} lg={7} style={{ display: 'flex' }}>
          <Card
            title="最左推导与分析树"
            style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
          >
            <div>
              <p>为描述文法定义的语言,需要使用推导的概念.推导的意思是,把产生式看成重写规则,把符号串中的非终结符用其产生式右部的串来代替.若符号串α中有两个以上的非终结符号,则对推导的每一步坚持把α中的最左非终结符号进行替换,称为最左推导.</p>
              <p>分析树是推导的图形表示.分析树上的每个分支结点都由非终结符标记,它的子结点由该非终结符本次推导所用产生式的右部的各符号从左到右依次来标记.分析树的叶结点由非终结符或终结符标记,所有这些标记从左到右构成一个句型.</p>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={24} md={7} lg={7} style={{ display: 'flex' }}>
          <Card
            title="语法提示"
            style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
          >
            <div>
              <p>使用该工具需要输入文法定义,开始符号,目标表达式.</p>
              <p>{"文法定义为形如 A -> B | C D | ... 的格式,注意换行"}</p>
              <p>开始符号必须为文法定义中的非终止符.</p>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={24} md={10} lg={10} style={{ display: 'flex' }}>
          <Card
            title="输入示例"
            style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
          >
            <Collapse
              size="small"
              items={[{
                key: '1',
                label: '第二次作业1',
                children: <pre style={{ whiteSpace: 'pre-wrap' }}>{example_1}</pre>
              }]}
            />
            <Collapse
              size="small"
              style={{ marginTop: 8 }}
              items={[{
                key: '2',
                label: '第二次作业2',
                children: <pre style={{ whiteSpace: 'pre-wrap' }}>{example_2}</pre>
              }]}
            />
          </Card>
        </Col>
      </Row>
      <TextArea size="large" rows={10} placeholder="请在这里输入文法定义" onChange={onGrammerChange} style={{ marginBottom: 16 }} />
      <Input size="large" placeholder="请在这里输入开始符号" onChange={onStartSymbolChange} style={{ marginBottom: 16 }} />
      <Search
        placeholder="请输入需要分析的表达式"
        enterButton="分析"
        size="large"
        onSearch={onParse}
        style={{ marginBottom: 16 }}
      />
      {showResult && (
        <div>
          {correct ? (
            <GenericParserViewer expr={expr} grammar={grammar!} startSymbol={startSymbol} />
          ) : (
            <Card title="分析结果" style={{ marginTop: 16 }}>文法定义错误或开始符号不在文法中</Card>
          )}
        </div>
      )}
    </div>
  )
}