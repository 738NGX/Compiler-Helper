import { useParams } from "react-router";
import MarkDownComponent from "~/tools/common/markdown";

import { exercise_1 } from "./1";

const mdContents: Record<string, string> = {
  "1": exercise_1,
};

export default function Brief() {
  const { id } = useParams<{ id: string }>();
  const md = mdContents[id!] || "未找到对应内容";

  return <MarkDownComponent content={md} />;
}
