import { Card, Input, Flex } from 'antd';
import type { GetProps } from 'antd';
import './regex-converter.css'
import { useState } from 'react';

type SearchProps = GetProps<typeof Input.Search>;
const { Search } = Input;

function NFAResult({ regexInput, style }: { regexInput: string, style?: React.CSSProperties }) {
  return (
    <div className="result" style={style}>
      <h2>正则式: {regexInput}</h2>
      <h3>NFA</h3>
      <p>这里是NFA的结果</p>
    </div>
  );
}

export default function RegexConverter() {
  const [regexInput, setRegexInput] = useState('');

  // 2. onSearch 时更新 state
  const onSearch: SearchProps['onSearch'] = (value) => {
    setRegexInput(value);
  };

  return (
    <div>
      <Flex justify="space-around">
        <Card title="正则式转换器" style={{ minWidth: 300 }}>
          <p>你可以输入一个正则式,程序首先将使用汤普森构造法将其构造为NFA,随后使用子集构造法将其构造为DFA,最后化简为Min-DFA.</p>
        </Card>
        <Card title="支持的语法" style={{ minWidth: 300, marginLeft: 16, marginRight: 16 }}>
          <ul className="d">
            <li>r = (s)</li>
            <li>r = st</li>
            <li>r = s|t</li>
            <li>r = s*</li>
            <li>r = s+</li>
            <li>r = s?</li>
            <li>r = ϵ</li>
          </ul>
        </Card>
        <Card title="输入示例" style={{ minWidth: 300 }}>
          <ul className="d">
            <li>(a|b)*</li>
            <li>(a*|b*)*</li>
            <li>((ϵ|a)b*)*</li>
            <li>(a|b)*abb(a|b)*</li>
          </ul>
        </Card>
      </Flex>
      <Search
        placeholder="请输入需要转换的正则式"
        allowClear
        enterButton="转换"
        size="large"
        onSearch={onSearch}
        style={{ marginTop: 16 }}
      />
      {regexInput ? <NFAResult regexInput={regexInput} style={{ marginTop: 16 }} /> : null}
    </div>
  );
}