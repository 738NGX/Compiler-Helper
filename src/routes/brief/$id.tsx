import { useParams } from "react-router";
import MarkDownComponent from "../../tools/common/markdown";

import { brief_1 } from "./1";
import { brief_2 } from "./2";
import { brief_3 } from "./3";


const mdContents: Record<string, string> = {
  "1": brief_1,
  "2": brief_2,
  "3": brief_3,
};

export default function Brief() {
  const { id } = useParams<{ id: string }>();
  const md = mdContents[id!] || "未找到对应内容";

  return <MarkDownComponent content={md} />;
}
