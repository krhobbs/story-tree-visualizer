import { type StoryNodeData, isStoryNode } from "@/types/story-types";
import type { ReactFlowJsonObject } from "@xyflow/react";

export const downloadFile = (filename: string, contents: string) => {
  const blob = new Blob([contents], { type: "application/json" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  document.body.appendChild(a);
  a.href = url;
  a.download = filename;

  setTimeout(() => {
    a.click();

    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }, 1);
};

export const parseGraphToStoryNodes = (storyGraph: ReactFlowJsonObject) => {
  const storyObj: {
    [nodeId: string]: StoryNodeData;
  } = {};

  storyGraph.nodes.forEach((node) => {
    if (isStoryNode(node)) {
      storyObj[node.id] = node.data;
    }
  });

  return storyObj;
};
