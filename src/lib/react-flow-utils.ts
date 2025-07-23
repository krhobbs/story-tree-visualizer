import type { Edge, Node } from "@xyflow/react";
import type { StoryNodeData, StoryNodeID } from "@/types/story-types";
import { positionNodesAsTree } from "./graph-utils";

export const generateNodesAndEdges = (
  data: Record<StoryNodeID, StoryNodeData>
) => {
  let totalNodes = 0;
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  for (const nodeId in data) {
    const node = data[nodeId];

    // Add the current "Story Node"
    nodes.push({
      type: "storyNode",
      id: nodeId,
      position: { x: 0, y: 0 },
      data: { ...node },
    });
    totalNodes++;

    if (node.choices.length > 0) {
      let index = 0;
      for (const choice of node.choices) {
        // Add the "Choice Node"
        const choiceId = `${nodeId}-choice-${index}`;
        nodes.push({
          type: "choiceNode",
          id: choiceId,
          position: { x: 0, y: 0 },
          data: { ...choice },
        });
        totalNodes++;
        // Add edge from current "Story Node" to the "Choice Node"
        edges.push({
          id: `${nodeId}-${choiceId}`,
          source: nodeId,
          target: choiceId,
        });
        // Add edge from "Choice Node" to the next "Story Node"
        edges.push({
          id: `${choiceId}-${choice.nextNode}`,
          source: choiceId,
          target: choice.nextNode,
        });
        index++;
      }
    } else if (node.nextNode) {
      // Add edge from the current "Story Node" to the next "Story Node"
      edges.push({
        id: `${nodeId}-${node.nextNode}`,
        source: nodeId,
        target: node.nextNode,
      });
    }
  }

  console.log(totalNodes);

  const { nodes: positionedNodes, edges: positionedEdges } =
    positionNodesAsTree(nodes, edges);

  return { nodes: positionedNodes, edges: positionedEdges };
};
