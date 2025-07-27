import act1Data from "../../assets/act2.json";
import { generateNodesAndEdges } from "@/lib/react-flow-utils";
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  type Edge,
  type Node,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
} from "@xyflow/react";
import { create } from "zustand";

const { nodes: initialNodes, edges: initialEdges } =
  generateNodesAndEdges(act1Data);

export interface TreeState {
  nodes: Node[];
  edges: Edge[];
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  onNodesChange: OnNodesChange<Node>;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
}

export const useTreeStore = create<TreeState>()((set, get) => {
  return {
    nodes: initialNodes,
    edges: initialEdges,
    setNodes: (nodes) => {
      set({ nodes });
    },
    setEdges: (edges: Edge[]) => {
      set({ edges });
    },
    onNodesChange: (changes) => {
      set({
        nodes: applyNodeChanges(changes, get().nodes),
      });
    },
    onEdgesChange: (changes) => {
      set({
        edges: applyEdgeChanges(changes, get().edges),
      });
    },
    onConnect: (connection) => {
      set({
        edges: addEdge(
          { ...connection, id: `${connection.source}-${connection.target}` },
          get().edges
        ),
      });
    },
  };
});
