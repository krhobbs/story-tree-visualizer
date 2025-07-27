import { positionNodesAsTree } from "@/lib/graph-utils";
import { Controls, ReactFlow, useReactFlow, useViewport, type ReactFlowInstance, type ReactFlowJsonObject } from "@xyflow/react";
import { useCallback, useState } from "react";
import { TopPanel } from "./panels";
import { ChoiceNode, StoryNode } from "./nodes";
import { useTreeStore, type TreeState } from './hooks/useTreeStore';
import { useShallow } from 'zustand/shallow';
import { downloadFile, parseGraphToStoryNodes } from "@/lib/download-file";
import { generateNodesAndEdges } from "@/lib/react-flow-utils";

const selector = (state: TreeState) => ({
  nodes: state.nodes,
  edges: state.edges,
  setNodes: state.setNodes,
  setEdges: state.setEdges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});


const nodeTypes = {
  storyNode: StoryNode,
  choiceNode: ChoiceNode
}

export function StoryTree() {
  const { nodes, edges, setNodes, setEdges, onNodesChange, onEdgesChange, onConnect } = useTreeStore(
    useShallow(selector),
  );
  const [treeInstance, setTreeInstance] = useState<ReactFlowInstance | null>(null);
  const { setViewport } = useReactFlow();

  const onLayout = useCallback(() => {
    const layouted = positionNodesAsTree(nodes, edges);

    setNodes([...layouted.nodes]);
    setEdges([...layouted.edges]);
  }, [nodes, edges]);

  const downloadStoryGraph = useCallback(() => {
    if (treeInstance) {
      const treeData = JSON.stringify(treeInstance.toObject());
      localStorage.setItem('story-graph', treeData);
      downloadFile('story-graph.json', treeData);
    }
  }, [treeInstance]);

  const saveStoryGraph = useCallback(() => {
    if (treeInstance) {
      const treeData = JSON.stringify(treeInstance.toObject());
      localStorage.setItem('story-graph', treeData)
    }
  }, [treeInstance]);

  const saveStoryData = useCallback(() => {
    if (treeInstance) {
      const storyData = JSON.stringify(parseGraphToStoryNodes(treeInstance.toObject()));
      downloadFile('story-data.json', storyData);
    }
  }, [treeInstance]);

  const restoreFlow = useCallback((flow: ReactFlowJsonObject) => {
    const { x = 0, y = 0, zoom = 1 } = flow.viewport;
    setNodes(flow.nodes || []);
    setEdges(flow.edges || []);
    setViewport({ x, y, zoom });
  }, [setNodes, setEdges, useViewport]);

  const importStoryData = useCallback((storyData: any) => {
    const { nodes: importedNodes, edges: importedEdges } = generateNodesAndEdges(storyData);
    setNodes(importedNodes);
    setEdges(importedEdges);
  }, [setNodes, setEdges]);

  return (
    <ReactFlow
      defaultViewport={{ x: 0, y: 150, zoom: 1 }}
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      panOnDrag={false}
      panOnScroll
      selectionOnDrag
      minZoom={0.05}
      nodeTypes={nodeTypes}
      onInit={setTreeInstance}
    >
      <TopPanel
        downloadStoryGraph={downloadStoryGraph}
        onLayout={onLayout}
        restoreFlow={restoreFlow}
        saveStoryGraph={saveStoryGraph}
        saveStoryData={saveStoryData}
        importStoryData={importStoryData}
      />
      <Controls />
    </ReactFlow>
  );
}