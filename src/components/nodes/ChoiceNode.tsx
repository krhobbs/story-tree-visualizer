import type { StoryChoiceData } from "@/types/story-types";
import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";
import type { CSSProperties } from "react";

const style: CSSProperties = {
  padding: '10px',
  borderRadius: '5px',
  width: '150px',
  fontSize: '12px',
  color: 'red',
  textAlign: 'center',
  border: '1px solid red',
}

type ChoiceNodeProps = Node<StoryChoiceData>

export function ChoiceNode(props: NodeProps<ChoiceNodeProps>) {
  return (
    <div style={style}>
      {props.data.text}
      <Handle type={"source"} position={Position.Bottom} />
      <Handle type={"target"} position={Position.Top} />
    </div>
  );
}