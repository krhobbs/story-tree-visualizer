import { Panel, type ReactFlowJsonObject } from "@xyflow/react"
import { Button } from "../ui/button"
import { CleanUpIcon } from "../icons"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "../ui/dropdown-menu"
import { Input } from "../ui/input"
import { useRef, type ChangeEvent } from "react"

interface TopPanelProps {
  downloadStoryGraph: () => void;
  onLayout: () => void;
  restoreFlow: (flow: ReactFlowJsonObject) => void
  saveStoryGraph: () => void;
  saveStoryData: () => void;
  importStoryData: (storyData: any) => void;
}

export function TopPanel({ downloadStoryGraph, onLayout, restoreFlow, saveStoryGraph, saveStoryData, importStoryData }: TopPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const importInputRef = useRef<HTMLInputElement>(null);

  const handleClickRestoreFromFile = () => {
    fileInputRef.current?.click()
  }

  const handleClickImport = () => {
    importInputRef.current?.click()
  }

  const handleFileChange = async (evt: ChangeEvent<HTMLInputElement>) => {
    if (evt.target.files) {
      const file = await evt.target.files[0].text();
      const flow = JSON.parse(file);
      restoreFlow(flow);
    }
  }

  const handleImportFileChange = async (evt: ChangeEvent<HTMLInputElement>) => {
    if (evt.target.files) {
      const file = await evt.target.files[0].text();
      const storyData = JSON.parse(file);
      importStoryData(storyData);
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
    <Panel className="flex" position="top-left">
      <Button className="rounded-r-none font-normal" onClick={() => onLayout()}>
        <CleanUpIcon color="#FFFFFF" /> Clean Up
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="rounded-none border-x-white border-x font-normal">Graph Data</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="max-w-3xs" align="start">
          <DropdownMenuLabel>Save and Load Story Graph Data</DropdownMenuLabel>
          <DropdownMenuLabel className="font-normal text-xs text-neutral-400 pt-0">
            Graph data includes the positions of each node and other data related to the graph visualization.
            Recommend you save this if you made any manual positioning adjustments to the graph.
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={saveStoryGraph}>Save to browser</DropdownMenuItem>
          <DropdownMenuItem onClick={downloadStoryGraph}>Save to file</DropdownMenuItem>
          <DropdownMenuItem onClick={() => {
            downloadStoryGraph();
            saveStoryGraph();
          }}>Save to both</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleBrowserRestore}>Load from browser</DropdownMenuItem>
          <DropdownMenuItem onClick={handleClickRestoreFromFile}>
            Load from file
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="rounded-l-none font-normal">Story Data</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="max-w-3xs" align="start">
          <DropdownMenuLabel>Save and Load Story Data</DropdownMenuLabel>
          <DropdownMenuLabel className="font-normal text-xs text-neutral-400 pt-0">
            Saves only story data. Excludes data related to positioning of nodes and any data related to the graph visualization.
            Loading raw story data will require manual positioning.
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={saveStoryData}>Export</DropdownMenuItem>
          <DropdownMenuItem onClick={handleClickImport}>Import</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Input type="file" accept=".json" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
      <Input type="file" accept=".json" className="hidden" ref={importInputRef} onChange={handleImportFileChange} />
    </Panel>
  )
}