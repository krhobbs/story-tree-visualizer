import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import type { DialogProps } from "@radix-ui/react-dialog";
import type { XYPosition } from "@xyflow/react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useForm } from 'react-hook-form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { Textarea } from "./ui/textarea";
import { isChoiceNode, isStoryNode, type CustomNode } from "@/types/story-types";

interface NewNodeModalProps {
  nodeData: { position: XYPosition, fromNode: CustomNode } | null;
  onAdd: (newNode: CustomNode, fromNode: CustomNode) => void;
  closeModal: () => void;
}

interface NewStoryNodeData {
  id: string;
  type: 'storyNode',
}

interface NewNodeFormData {
  id: string;
  type: string;
  speaker: string;
  text: string;
  shortText: string;
}

export const NewNodeModal = ({ open, onOpenChange, nodeData, onAdd, closeModal }: NewNodeModalProps & DialogProps) => {
  const allowChoiceNode = nodeData?.fromNode && isStoryNode(nodeData.fromNode) && !(nodeData.fromNode.data.nextNode);
  const allowStoryNode = (nodeData?.fromNode && isChoiceNode(nodeData.fromNode)) ||
    (nodeData?.fromNode && isStoryNode(nodeData.fromNode) &&
      nodeData.fromNode.data.choices.length === 0 && !(nodeData.fromNode.data.nextNode));

  const form = useForm<NewNodeFormData>({
    defaultValues: {
      id: "",
      type: "",
      speaker: "",
      text: ""
    }
  });

  const onSubmit = (data: NewNodeFormData) => {
    if (!nodeData) {
      return;
    }
    if (data.type === 'storyNode') {
      onAdd({
        id: data.id,
        position: nodeData?.position,
        type: data.type,
        data: {
          text: data.text,
          speaker: data.speaker,
          choices: [],
          checkpoint: false
        }
      }, nodeData.fromNode);
    }
    if (data.type === 'choiceNode') {
      onAdd({
        id: data.id,
        position: nodeData.position,
        type: data.type,
        data: {
          text: data.text,
          shortText: "",
          nextNode: ""
        }
      }, nodeData.fromNode);
    }
    closeModal();
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
            <DialogHeader>
              <DialogTitle>Add New Node</DialogTitle>
              <DialogDescription>Add a new node to the graph connected to {nodeData?.fromNode.id}</DialogDescription>
              {!allowChoiceNode && !allowStoryNode &&
                <DialogDescription className="text-red-400">
                  Unable to add new node in this configuration.
                </DialogDescription>}
            </DialogHeader>

            <FormField control={form.control} name="id" render={({ field }) => (
              <FormItem>
                <FormLabel className="hidden">Node ID</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="id" {...field} />
                </FormControl>
              </FormItem>
            )} />

            <FormField control={form.control} name="type" render={({ field }) => (
              <FormItem>
                <FormLabel className="hidden">Node Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="node type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="storyNode" disabled={!allowStoryNode}>Story</SelectItem>
                    <SelectItem value="choiceNode" disabled={!allowChoiceNode}>Choice</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )} />

            {form.watch('type') === 'storyNode' &&
              <>
                <Label className="hidden" htmlFor="speaker">Speaker</Label>
                <Input id="speaker" type="text" placeholder="speaker" {...form.register("speaker")} />
              </>}

            {form.watch('type') === 'choiceNode' &&
              <>
                <Label className="hidden" htmlFor="shortText">Short Text</Label>
                <Input id="shortText" type="text" placeholder="short text" {...form.register("shortText")} />
              </>}

            <Label className="hidden" htmlFor="text">Text</Label>
            <Textarea id="text" placeholder="node text" {...form.register("text")} />

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={!allowChoiceNode && !allowStoryNode}>Add</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}