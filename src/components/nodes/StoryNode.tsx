import type { StoryNodeData } from "@/types/story-types";
import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";
import type { CSSProperties } from "react";
import { Badge } from "../ui/badge";

const speakerColor: Record<string, string> = {
  prosper: 'bg-blue-200',
  grace: 'bg-violet-200',
  system: 'bg-stone-200',
  audio_input: 'bg-orange-200',
  prosper_audio: 'bg-blue-200',
  system_error: 'bg-red-200'
}

const style: CSSProperties = {
  padding: '10px',
  borderRadius: '5px',
  width: '220px',
  fontSize: '12px',
  color: 'black',
  border: '1px solid black',
  display: 'flex',
  flexDirection: 'column',
  gap: '.5rem'
}

type StoryNodeProps = Node<StoryNodeData>

export function StoryNode(props: NodeProps<StoryNodeProps>) {
  return (
    <div style={style}>
      <Badge variant="secondary" className={`${speakerColor[props.data.speaker] ?? ''} text-sm`}>{props.data.speaker}</Badge>
      <p className='text-neutral-950 text-lg'>{props.data.text}</p>
      <div>
        <p className='text-neutral-400 text-sm'>id: {props.id}</p>
        <p className='text-neutral-400 text-sm'>checkpoint: {String(props.data.checkpoint)}</p>
      </div>
      <Handle type={"source"} position={Position.Bottom} onConnect={(evt) => { console.log('On connect.', evt) }} />
      <Handle type={"target"} position={Position.Top} onConnect={(evt) => { console.log('On connect.', evt) }} />
    </div>
  );
}