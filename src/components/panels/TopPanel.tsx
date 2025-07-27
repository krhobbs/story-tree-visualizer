import { Panel, type ReactFlowJsonObject } from "@xyflow/react"
import { Button } from "../ui/button"
import { CleanUpIcon } from "../icons"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "../ui/dropdown-menu"
import { Input } from "../ui/input"
import { useRef, type ChangeEvent } from "react"

interface TopPanelProps {
  downloadStoryGraph: () => void;
  onLayout: () => void;
  restoreFlow: (flow: ReactFlowJsonObject) => void
  saveStoryGraph: () => void;
}

export function TopPanel({ downloadStoryGraph, onLayout, restoreFlow, saveStoryGraph }: TopPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (evt: ChangeEvent<HTMLInputElement>) => {
    if (evt.target.files) {
      const file = await evt.target.files[0].text();
      const flow = JSON.parse(file);
      restoreFlow(flow);
    }
  }

  const handleBrowserRestore = () => {
    const storyGraph = localStorage.getItem('story-graph');
    if (storyGraph) {
      const flow = JSON.parse(storyGraph);
      restoreFlow(flow);
    }
  }

  return (
    <Panel className="flex gap-1" position="top-left">
      <Button onClick={() => onLayout()}>
        <CleanUpIcon color="#FFFFFF" /> Clean Up
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>Save</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={saveStoryGraph}>Save to Browser</DropdownMenuItem>
          <DropdownMenuItem onClick={downloadStoryGraph}>Save to File</DropdownMenuItem>
          <DropdownMenuItem onClick={() => {
            downloadStoryGraph();
            saveStoryGraph();
          }}>Save to Both</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>Restore</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={handleBrowserRestore}>Restore from Browser</DropdownMenuItem>
          <DropdownMenuItem onClick={handleClick}>
            Restore from File
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Input type="file" accept=".json" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
    </Panel>
  )
}