"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { MemberSelector } from "@/components/forms/member-selector"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { ImageUploadField } from "@/components/forms/image-upload-field"

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const projectColors = [
    { id: 'bg-accent-pink', class: 'bg-accent-pink', selectedClass: 'ring-accent-pink' },
    { id: 'bg-accent-purple', class: 'bg-accent-purple', selectedClass: 'ring-accent-purple' },
    { id: 'bg-accent-teal', class: 'bg-accent-teal', selectedClass: 'ring-accent-teal' },
    { id: 'bg-primary', class: 'bg-primary', selectedClass: 'ring-primary' },
];

export function CreateProjectModal({ isOpen, onClose, onSubmit }: CreateProjectModalProps) {
  const [name, setName] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [color, setColor] = React.useState(projectColors[0].id)
  const [dueDate, setDueDate] = React.useState<Date | undefined>(undefined)
  const [members, setMembers] = React.useState<string[]>([])
  const [projectImage, setProjectImage] = React.useState<File | null>(null)
  const [bannerImage, setBannerImage] = React.useState<File | null>(null)

  const handleSubmit = () => {
    onSubmit({ name, description, color, dueDate, members, projectImage, bannerImage });
    onClose();
  }

  const FormContent = (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Project Name</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Q4 Marketing Campaign" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Add a short description..." />
      </div>
      <ImageUploadField label="Project Image" name="projectImage" onChange={setProjectImage} />
      <ImageUploadField label="Project Banner" name="bannerImage" onChange={setBannerImage} />
      <div className="space-y-2">
        <Label>Project Color</Label>
        <div className="flex gap-3">
          {projectColors.map((c) => (
            <button
              key={c.id}
              type="button"
              className={cn("w-8 h-8 rounded-full transition-transform hover:scale-110", c.class, color === c.id && `ring-2 ${c.selectedClass} ring-offset-2 ring-offset-background`)}
              onClick={() => setColor(c.id)}
            />
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <Label>Due Date (Optional)</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !dueDate && "text-muted-foreground")}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus /></PopoverContent>
        </Popover>
      </div>
      <div className="space-y-2">
        <Label>Team Members</Label>
        <MemberSelector selectedMembers={members} onSelectMembers={setMembers} />
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-lg max-h-[90vh] flex flex-col p-0 glass-card">
        <DialogHeader className="p-6 pb-4 border-b border-border/50 flex-shrink-0">
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>Fill in the details to start your new project.</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto min-h-0">
            <div className="p-6">
                {FormContent}
            </div>
        </div>

        <DialogFooter className="p-4 border-t border-border/50 flex-shrink-0">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Create Project</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}