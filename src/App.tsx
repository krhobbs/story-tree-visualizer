import act1Data from './assets/act1.json';
import { useCallback } from 'react';
import { ReactFlow, Panel, ReactFlowProvider, useNodesState, useEdgesState, type Edge, type Node } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { StoryNode } from './components/StoryNode/StoryNode';
import { Button } from './components/ui/button';
import { CleanUpIcon } from './icons/CleanUpIcon';
import { positionNodesAsTree } from './lib/graph-utils';
import { generateNodesAndEdges } from './lib/react-flow-utils';
import { ChoiceNode } from './components/ChoiceNode/ChoiceNode';

const { nodes: initialNodes, edges: initialEdges } = generateNodesAndEdges(act1Data);
const nodeTypes = {
  storyNode: StoryNode,
  choiceNode: ChoiceNode
}

const LayoutFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onLayout = useCallback(
    (direction: string) => {
      console.log(nodes);
      const layouted = positionNodesAsTree(nodes, edges, { direction });

      setNodes([...layouted.nodes]);
      setEdges([...layouted.edges]);
    },
    [nodes, edges],
  );

  return (
    <ReactFlow
      defaultViewport={{ x: -200, y: 150, zoom: 1 }}
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
      <Panel position="top-left">
        <Button onClick={() => onLayout('TB')}>
          <CleanUpIcon color="#FFFFFF" /> Clean Up
        </Button>
      </Panel>
    </ReactFlow>
  );
};

export default function () {
  return (
    <ReactFlowProvider>
      <div style={{ width: '100vw', height: '100vh' }}>
        <LayoutFlow />
      </div>
    </ReactFlowProvider>
  );
}