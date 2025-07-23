import act1Data from '../assets/act2.json';
import { positionNodesAsTree } from "@/lib/graph-utils";
import { Controls, ReactFlow, useEdgesState, useNodesState } from "@xyflow/react";
import { useCallback } from "react";
import { TopPanel } from "./panels";
import { ChoiceNode, StoryNode } from "./nodes";
import { generateNodesAndEdges } from "@/lib/react-flow-utils";

const { nodes: initialNodes, edges: initialEdges } = generateNodesAndEdges(act1Data);
const nodeTypes = {
  storyNode: StoryNode,
  choiceNode: ChoiceNode
}

export function StoryTree() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onLayout = useCallback(() => {
    const layouted = positionNodesAsTree(nodes, edges);

    setNodes([...layouted.nodes]);
    setEdges([...layouted.edges]);
  }, [nodes, edges]);

  return (
    <ReactFlow
      defaultViewport={{ x: 0, y: 150, zoom: 1 }}
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      panOnDrag={false}
      panOnScroll
      selectionOnDrag
      minZoom={0.05}
      nodeTypes={nodeTypes}
    >
      <TopPanel onLayout={onLayout} />
      <Controls />
    </ReactFlow>
  );
}