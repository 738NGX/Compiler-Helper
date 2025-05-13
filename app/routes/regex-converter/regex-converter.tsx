import { Card, Input, Flex, Table } from 'antd';
import type { GetProps } from 'antd';
import './regex-converter.css'
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
      <Card title="输入正规式" style={{ minWidth: 300 }}>
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
  };

  return (
    <div>
      <Flex justify="space-around">
        <Card title="正规式转换器" style={{ minWidth: 300 }}>
          <p>你可以输入一个正规式,程序首先将使用汤普森构造法将其构造为NFA,随后使用子集构造法将其构造为DFA,最后化简为Min-DFA.</p>
        </Card>
        <Card title="支持的语法" style={{ minWidth: 300, marginLeft: 16, marginRight: 16 }}>
          <ul className="d">
            <li>r = (s)</li>
            <li>r = st</li>
            <li>r = s|t</li>
            <li>r = s*</li>
            <li>r = s+</li>
            <li>r = s?</li>
            <li>r = ε</li>
          </ul>
        </Card>
        <Card title="输入示例" style={{ minWidth: 300 }}>
          <ul className="d">
            <li>(a|b)*</li>
            <li>(a*|b*)*</li>
            <li>((ε|a)b*)*</li>
            <li>(a|b)*abb(a|b)*</li>
          </ul>
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