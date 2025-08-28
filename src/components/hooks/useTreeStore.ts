import {
  isChoiceNode,
  isStoryNode,
  type ChoiceNodeData,
  type StoryNodeData,
} from "@/types/story-types";
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

export interface TreeState {
  nodes: Node[];
  edges: Edge[];
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  onNodesChange: OnNodesChange<Node>;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  addNode: (node: Node) => void;
  addEdge: (edge: Edge) => void;
  updateNode: (
    nodeID: string,
    data: Partial<StoryNodeData | ChoiceNodeData>
  ) => void;
  updateNodeOnDeleteEdge: (sourceID: string, targetID: string) => void;
}

export const useTreeStore = create<TreeState>()((set, get) => {
  return {
    nodes: [],
    edges: [],
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
    addNode: (node: Node) => {
      set((state) => ({
        nodes: [...state.nodes, node],
      }));
    },
    addEdge: (edge: Edge) => {
      set((state) => ({
        edges: [...state.edges, edge],
      }));
    },
    updateNode: (
      nodeID: string,
      data: Partial<StoryNodeData | ChoiceNodeData>
    ) => {
      set((state) => ({
        nodes: state.nodes.map((node) => {
          if (node.id === nodeID) {
            return {
              ...node,
              data: { ...node.data, ...data },
            };
          }
          return node;
        }),
      }));
    },
    updateNodeOnDeleteEdge: (sourceID: string, targetID: string) => {
      const nodes = get().nodes;
      let targetNode: Node | undefined = undefined;
      let sourceNode: Node | undefined = undefined;

      for (const node of nodes) {
        if (node.id === sourceID) sourceNode = node;
        if (node.id === targetID) targetNode = node;
        if (sourceNode && targetNode) break;
      }

      let nodeToUpdate: string | undefined = undefined;
      let updatedData: StoryNodeData | ChoiceNodeData | undefined = undefined;

      // Case: Source = Story and Target = Story
      // Reset 'nextNode' on the source
      if (isStoryNode(sourceNode) && isStoryNode(targetNode)) {
        nodeToUpdate = sourceID;
        updatedData = {
          ...sourceNode.data,
          choices: [...sourceNode.data.choices],
          nextNode: "",
        };
      }

      // Case: Source = Story and Target = Choice
      // Remove item from 'choices' array of the source
      if (isStoryNode(sourceNode) && isChoiceNode(targetNode)) {
        nodeToUpdate = sourceID;
        updatedData = {
          ...sourceNode.data,
          choices: sourceNode.data.choices.filter(
            (choice) => choice.nextNode !== targetNode.data.nextNode
          ),
        };
      }

      // Case: Source = Choice and Target = Story
      // Reset 'nextNode' on the node with id === source.data.nodeID for the choice that has nextNode === source.data.nextNode
      if (isChoiceNode(sourceNode)) {
        const choiceParent = nodes.find(
          (node) => node.id === sourceNode.data.nodeID
        );
        if (isStoryNode(choiceParent)) {
          nodeToUpdate = choiceParent.id;
          updatedData = {
            ...choiceParent.data,
            choices: choiceParent.data.choices.map((choice) => {
              if (choice.nextNode === sourceNode.data.nextNode) {
                return {
                  ...choice,
                  nextNode: "",
                };
              }
              return choice;
            }),
          };
        }
      }

      if (nodeToUpdate && updatedData) {
        set((state) => ({
          nodes: state.nodes.map((node) => {
            if (node.id === nodeToUpdate) {
              return {
                ...node,
                data: updatedData,
              };
            }
            return node;
          }),
        }));
      }
    },
  };
});
