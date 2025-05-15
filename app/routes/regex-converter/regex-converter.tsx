import { Card, Input, Flex, Table, Collapse } from 'antd';
import type { GetProps } from 'antd';
import { useState } from 'react';
import FiniteAutomatonComponent, { FiniteAutomaton } from '~/components/finite-automaton/finite-automaton';
import { convertRegexToNFA } from '~/tools/2/convertRegexToNFA';
import { convertNFAToDFA, getNfa2DfaTransTable } from '~/tools/2/convertNFAToDFA';
import { convertDFAToMinDFA, getDfa2MinDfaTransTable } from '~/tools/2/convertDFAToMinDFA';

type SearchProps = GetProps<typeof Input.Search>;
const { Search } = Input;

function RegexResult({ regexInput, style }: { regexInput: string, style?: React.CSSProperties }) {
  return (
    <div className="result" style={style}>
      <Card className="min-w-[300px]" title="输入正规式">
        <p><b>{regexInput}</b></p>
      </Card>
    </div>
  );
}

export default function RegexConverter() {
  const [regexInput, setRegexInput] = useState('');
  const [nfaResult, setNfaResult] = useState<FiniteAutomaton | null>(null);
  const [nfa2dfaTransTable, setNfa2dfaTransTable] = useState<{ dataSource: any[], columns: any } | null>(null);
  const [dfaResult, setDfaResult] = useState<FiniteAutomaton | null>(null);
  const [dfa2minDfaTransTable, setDfa2minDfaTransTable] = useState<{ dataSource: any[], columns: any } | null>(null);
  const [minDfaResult, setMinDfaResult] = useState<FiniteAutomaton | null>(null);

  const onConvert: SearchProps['onSearch'] = (value) => {
    setRegexInput(value);
    const nfa = convertRegexToNFA(value);
    setNfaResult(nfa);
    const { dataSource, columns } = getNfa2DfaTransTable(nfa);
    setNfa2dfaTransTable({ dataSource, columns });
    const dfa = convertNFAToDFA(nfa);
    setDfaResult(dfa);
    const { dataSource: dfaDataSource, columns: dfaColumns } = getDfa2MinDfaTransTable(dfa);
    setDfa2minDfaTransTable({ dataSource: dfaDataSource, columns: dfaColumns });
    const minDfa = convertDFAToMinDFA(dfa);
    setMinDfaResult(minDfa);
    console.log(minDfa);
  };

  return (
    <div>
      <Flex justify="space-around">
        <Card className="min-w-[300px]" title="正规式转换器" >
          <p>你可以输入一个正规式,程序首先将使用汤普森构造法将其构造为NFA,随后使用子集构造法将其构造为DFA,最后化简为Min-DFA.</p>
          <p>注意:输入的正规式必须符合语法要求,否则转换会失败.</p>
          <p>使用汤普森构造法时,可以先写出一些简单的NFA,然后对他们进行组合,你可以在右边的语法提示中找到一些例子.</p>
        </Card>
        <Card className="min-w-[400px]" title="语法提示" style={{ marginLeft: 16, marginRight: 16 }} >
          <Collapse
            size="small" style={{ marginTop: 8 }}
            items={[{ key: '1', label: 'r = (s)', children: <FiniteAutomatonComponent fa={convertRegexToNFA("(s)")} /> }]}
          />
          <Collapse
            size="small" style={{ marginTop: 8 }}
            items={[{ key: '1', label: 'r = st', children: <FiniteAutomatonComponent fa={convertRegexToNFA("st")} /> }]}
          />
          <Collapse
            size="small" style={{ marginTop: 8 }}
            items={[{ key: '1', label: 'r = s|t', children: <FiniteAutomatonComponent fa={convertRegexToNFA("s|t")} /> }]}
          />
          <Collapse
            size="small" style={{ marginTop: 8 }}
            items={[{ key: '1', label: 'r = s*', children: <FiniteAutomatonComponent fa={convertRegexToNFA("s*")} /> }]}
          />
          <Collapse
            size="small" style={{ marginTop: 8 }}
            items={[{ key: '1', label: 'r = s+', children: <FiniteAutomatonComponent fa={convertRegexToNFA("s+")} /> }]}
          />
          <Collapse
            size="small" style={{ marginTop: 8 }}
            items={[{ key: '1', label: 'r = s?', children: <FiniteAutomatonComponent fa={convertRegexToNFA("s?")} /> }]}
          />
          <Collapse
            size="small" style={{ marginTop: 8 }}
            items={[{ key: '1', label: 'r = ε', children: <FiniteAutomatonComponent fa={convertRegexToNFA("ε")} /> }]}
          />
        </Card>
        <Card className="min-w-[300px]" title="输入示例" >
          <ul className="d">
            <li>(a|b)*</li>
            <li>(a*|b*)*</li>
            <li>((ε|a)b*)*</li>
            <li>(a|b)*abb(a|b)*</li>
          </ul>
          <p>第一次作业: 将正则表达式<b>(a|b)*a(a|b|ε)*</b>转化为一个NFA,然后利用子集构造法将NFA转化为一个DFA.</p>
        </Card>
      </Flex>
      <Search
        placeholder="请输入需要转换的正规式"
        allowClear
        enterButton="转换"
        size="large"
        onSearch={onConvert}
        style={{ marginTop: 16 }}
      />
      {regexInput ? <RegexResult regexInput={regexInput} style={{ marginTop: 16 }} /> : null}
      {regexInput
        ? (
          nfaResult
            ? <FiniteAutomatonComponent fa={nfaResult} title="NFA" style={{ marginTop: 16 }} />
            : <Card title="NFA" style={{ marginTop: 16 }}><p>转换失败,请检查输入的正规式是否符合语法要求.</p></Card>
        )
        : null
      }
      {regexInput
        ? (
          <Card title="NFA=>DFA状态转移表" style={{ marginTop: 16 }}>
            {
              nfa2dfaTransTable
                ? <Table<any> columns={nfa2dfaTransTable.columns} dataSource={nfa2dfaTransTable.dataSource} />
                : <p>转换失败,请检查输入的正规式是否符合语法要求.</p>
            }
          </Card>
        )
        : null
      }
      {regexInput
        ? (
          dfaResult
            ? <FiniteAutomatonComponent fa={dfaResult} title="DFA" style={{ marginTop: 16 }} />
            : <Card title="DFA" style={{ marginTop: 16 }}><p>转换失败,请检查输入的正规式是否符合语法要求.</p></Card>
        )
        : null
      }
      {regexInput
        ? (
          <Card title="DFA=>Min-DFA状态转移表" style={{ marginTop: 16 }}>
            {
              dfa2minDfaTransTable
                ? <Table<any> columns={dfa2minDfaTransTable.columns} dataSource={dfa2minDfaTransTable.dataSource} />
                : <p>转换失败,请检查输入的正规式是否符合语法要求.</p>
            }
          </Card>
        )
        : null
      }
      {regexInput
        ? (
          minDfaResult
            ? <FiniteAutomatonComponent fa={minDfaResult} title="Min-DFA" style={{ marginTop: 16 }} />
            : <Card title="Min-DFA" style={{ marginTop: 16 }}><p>转换失败,请检查输入的正规式是否符合语法要求.</p></Card>
        )
        : null
      }
    </div>
  );
}