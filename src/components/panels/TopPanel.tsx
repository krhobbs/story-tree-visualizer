import { Panel } from "@xyflow/react"
import { Button } from "../ui/button"
import { CleanUpIcon } from "../icons"

export function TopPanel({ onLayout }: { onLayout: () => void }) {
  return (
    <Panel position="top-left">
      <Button onClick={() => onLayout()}>
        <CleanUpIcon color="#FFFFFF" /> Clean Up
      </Button>
    </Panel>
  )
}