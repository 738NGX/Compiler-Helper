// MarkDownComponent.tsx
import { useEffect, useState } from 'react';
import { Row, Col, Anchor } from 'antd';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';

export interface MarkDownComponentProps {
  content: string;
}

type AnchorItem = {
  key: string;
  href: string;
  title: string;
};

export default function MarkDownComponent({ content }: MarkDownComponentProps) {
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
    <Row>
      <Col span={16}>
        <div className="markdown-body" style={{ margin: '0 20px' }}>
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug]}>
            {content}
          </ReactMarkdown>
        </div>
      </Col>
      <Col span={8}>
        <Anchor items={items} />
      </Col>
    </Row>
  );
}
