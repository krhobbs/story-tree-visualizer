import Dagre from "@dagrejs/dagre";
import { type Edge, type Node } from "@xyflow/react";

export const positionNodesAsTree = (
  nodes: Node[],
  edges: Edge[],
  options: { direction: string } = { direction: "TB" }
): { nodes: Node[]; edges: Edge[] } => {
  const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: options.direction, ranksep: 50, nodesep: 20 });

  edges.forEach((edge) => {
    g.setEdge(edge.source, edge.target, { weight: edge.data?.weight ?? 1 });
  });
  nodes.forEach((node) =>
    g.setNode(node.id, {
      ...node,
      width: node.measured?.width ?? 150,
      height: node.measured?.height ?? 58,
    })
  );

  Dagre.layout(g);

  return {
    nodes: nodes.map((node) => {
      const position = g.node(node.id);
      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      const x = position.x - (node.measured?.width ?? 150) / 2;
      const y = position.y - (node.measured?.height ?? 58) / 2;

      return { ...node, position: { x, y } };
    }),
    edges,
  };
};
