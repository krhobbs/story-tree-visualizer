import type { Node } from "@xyflow/react";

export type StoryNodeID = string;

export interface StoryNodeData {
  text: string;
  speaker: string;
  choices: ChoiceData[];
  checkpoint: boolean;
  nextNode?: StoryNodeID;
  [key: string]: unknown;
}

export interface ChoiceData {
  text: string;
  shortText: string;
  nextNode: StoryNodeID;
  trust?: number;
  stress?: number;
  [key: string]: unknown;
}

export interface ChoiceNodeData extends ChoiceData {
  nodeID: StoryNodeID; // The StoryNode associated with this choice
}

export type StoryNode = Node<StoryNodeData>;
export type ChoiceNode = Node<ChoiceNodeData>;

export type CustomNode = StoryNode | ChoiceNode;

export const isStoryNode = (node?: Node): node is StoryNode => {
  if (node) {
    return node.type === "storyNode";
  }
  return false;
};

export const isChoiceNode = (node?: Node): node is ChoiceNode => {
  if (node) {
    return node.type === "choiceNode";
  }
  return false;
};
