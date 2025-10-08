import { Panel } from "@xyflow/react"
import { Button } from "../ui/button"
// import { CleanUpIcon } from "../icons"

interface EditPanelProps {
  onAdd: () => void;
  onLayout: () => void;
}

export function EditPanel({ onLayout, onAdd }: EditPanelProps) {

  return (
    <Panel className="flex" position="top-right">
      <Button onClick={onAdd}>New</Button>
      <Button onClick={onLayout}>Layout</Button>
    </Panel>
  )
}