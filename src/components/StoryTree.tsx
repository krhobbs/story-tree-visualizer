import { positionNodesAsTree } from "@/lib/graph-utils";
import {
  Controls,
  ReactFlow,
  useReactFlow,
  useViewport,
  type Edge,
  type OnConnectEnd,
  type ReactFlowInstance,
  type ReactFlowJsonObject,
  type XYPosition,
} from "@xyflow/react";
import { useCallback, useRef, useState } from "react";
import { TopPanel } from "./panels";
import { ChoiceNode, StoryNode } from "./nodes";
import { useTreeStore, type TreeState } from './hooks/useTreeStore';
import { useShallow } from 'zustand/shallow';
import { downloadFile, parseGraphToStoryNodes } from "@/lib/download-file";
import { generateNodesAndEdges } from "@/lib/react-flow-utils";
import { NewNodeModal } from "./NewNodeModal";
import { isChoiceNode, isStoryNode, type CustomNode } from "@/types/story-types";
import { EditPanel } from "./panels/EditPanel";

const selector = (state: TreeState) => ({
  nodes: state.nodes,
  edges: state.edges,
  setNodes: state.setNodes,
  setEdges: state.setEdges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  addNode: state.addNode,
  addEdge: state.addEdge,
  updateNodeOnDeleteEdge: state.updateNodeOnDeleteEdge
});


const nodeTypes = {
  storyNode: StoryNode,
  choiceNode: ChoiceNode
}

export function StoryTree() {
  const {
    nodes,
    edges,
    setNodes,
    setEdges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    addEdge,
    updateNodeOnDeleteEdge } = useTreeStore(
      useShallow(selector),
    );
  const [treeInstance, setTreeInstance] = useState<ReactFlowInstance | null>(null);
  const { setViewport, screenToFlowPosition } = useReactFlow();
  const [showNewNodeModal, setShowNewNodeModal] = useState(false);
  const newNodeData = useRef<{ position: XYPosition, fromNode: CustomNode } | null>(null);

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

  const onConnectEnd = useCallback<OnConnectEnd>(
    (event, connectionState) => {
      const fromNode = connectionState.fromNode;
      // when a connection is dropped on the pane it's not valid
      if (!connectionState.isValid && fromNode && (isStoryNode(fromNode) || isChoiceNode(fromNode))) {
        // we need to remove the wrapper bounds, in order to get the correct position
        const { clientX, clientY } =
          'changedTouches' in event ? event.changedTouches[0] : event;

        newNodeData.current = {
          position: screenToFlowPosition({
            x: clientX,
            y: clientY,
          }),
          fromNode
        }

        setShowNewNodeModal(true);
      }
    },
    [screenToFlowPosition],
  );

  const onEdgesDelete = useCallback((edges: Edge[]) => {
    updateNodeOnDeleteEdge(edges[0].source, edges[0].target);
  }, [])

  const addNewNode = useCallback((newNode: CustomNode, fromNode: CustomNode | null | undefined) => {
    if (fromNode === null || fromNode === undefined) {
      addNode(newNode);
      return;
    }
    const edgeId = `${fromNode.id}-${newNode.id}`

    if (isChoiceNode(newNode) && isStoryNode(fromNode)) {
      fromNode.data.choices.push({ ...newNode.data, nextNode: "" })
    }
    if (isStoryNode(newNode)) {
      fromNode.data.nextNode = newNode.id;
    }

    addNode(newNode);
    addEdge({ id: edgeId, source: fromNode.id, target: newNode.id })
  }, [])

  const onAddNewClick = useCallback(() => {
    newNodeData.current = null;
    setShowNewNodeModal(true);
  }, []);

  return (
    <ReactFlow
      defaultViewport={{ x: 0, y: 150, zoom: 1 }}
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onConnectEnd={onConnectEnd}
      onEdgesDelete={onEdgesDelete}
      // onSelectionChange={(params) => { console.log(params.nodes) }}
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
      <EditPanel onLayout={onLayout} onAdd={onAddNewClick} />
      <NewNodeModal open={showNewNodeModal} onOpenChange={setShowNewNodeModal} nodeData={newNodeData.current} onAdd={addNewNode} closeModal={() => setShowNewNodeModal(false)} />
      <Controls />
    </ReactFlow>
  );
}