export type StoryNodeID = string;

export type StoryNodeData = {
  text: string;
  speaker: number;
  choices: StoryChoiceData[] | never[];
  checkpoint: boolean;
  nextNode?: StoryNodeID;
};

export type StoryChoiceData = {
  text: string;
  shortText: string;
  nextNode: StoryNodeID;
  trust?: number;
  stress?: number;
};
