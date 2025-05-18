// MarkDownComponent.tsx
import { useEffect, useState } from 'react';
import { Row, Col, Anchor } from 'antd';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

export interface MarkDownComponentProps {
  content: string;
  showAnchor?: boolean;
  style?: React.CSSProperties;
  bodyStyle?: React.CSSProperties;
  className?: string;
}

type AnchorItem = {
  key: string;
  href: string;
  title: string;
};

export default function MarkDownComponent({ content, showAnchor = true, style, bodyStyle, className = "" }: MarkDownComponentProps) {
  const [items, setItems] = useState<AnchorItem[]>([]);

  useEffect(() => {
    // 渲染完成后收集带 id 的标题生成目录
    const timer = setTimeout(() => {
      const headers = Array.from(
        document.querySelectorAll<HTMLElement>(
          '.markdown-body h1[id], .markdown-body h2[id], .markdown-body h3[id], .markdown-body h4[id]'
        )
      );
      const newItems = headers.map((h) => ({
        key: h.id,
        href: `#${h.id}`,
        title: h.innerText.trim(),
      }));
      setItems(newItems);
    }, 100);
    return () => clearTimeout(timer);
  }, [content]);

  return (
    <div style={{ ...style }} className={className}>
      <Row>
        <Col xs={24} sm={24} md={showAnchor ? 20 : 24} lg={showAnchor ? 16 : 24}>
          <div className="markdown-body" style={{ margin: showAnchor ? "0 20px" : 0, ...bodyStyle }}>
            <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeSlug, rehypeKatex]}>
              {content}
            </ReactMarkdown>
          </div>
        </Col>
        <Col xs={0} sm={0} md={showAnchor ? 4 : 0} lg={showAnchor ? 8 : 0}>
          <Anchor items={items} />
        </Col>
      </Row>
    </div>
  );
}
