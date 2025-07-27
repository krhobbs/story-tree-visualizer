import type { Node } from "@xyflow/react";

export type StoryNodeID = string;

export type StoryNodeData = {
  text: string;
  speaker: string;
  choices: StoryChoiceData[] | never[];
  checkpoint: boolean;
  nextNode?: StoryNodeID;
  [key: string]: unknown;
};

export type StoryChoiceData = {
  text: string;
  shortText: string;
  nextNode: StoryNodeID;
  trust?: number;
  stress?: number;
  [key: string]: unknown;
};

export type StoryNode = Node<StoryNodeData>;
export type ChoiceNode = Node<StoryChoiceData>;

export const isStoryNode = (node: Node): node is StoryNode => {
  return node.type === "storyNode";
};
