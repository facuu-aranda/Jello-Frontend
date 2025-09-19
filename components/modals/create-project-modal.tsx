"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { MemberSelector } from "@/components/forms/member-selector"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { ImageUploadField } from "@/components/forms/image-upload-field"
import { DatePicker } from "../ui/date-picker"
import { useAuth } from "@/contexts/AuthContext"
import { api } from "@/lib/api/client"

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  // CAMBIO: La función ya no espera recibir el proyecto como argumento.
  onProjectCreated: () => void;
}

const projectColors = [
  { id: 'bg-accent-pink', class: 'bg-accent-pink', selectedClass: 'ring-accent-pink' },
  { id: 'bg-accent-purple', class: 'bg-accent-purple', selectedClass: 'ring-accent-purple' },
  { id: 'bg-accent-teal', class: 'bg-accent-teal', selectedClass: 'ring-accent-teal' },
  { id: 'bg-primary', class: 'bg-primary', selectedClass: 'ring-primary' },
];

export function CreateProjectModal({ isOpen, onClose, onProjectCreated }: CreateProjectModalProps) {
  const { token } = useAuth();

  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [color, setColor] = React.useState(projectColors[0].id);
  const [dueDate, setDueDate] = React.useState<Date | undefined>();
  const [members, setMembers] = React.useState<string[]>([]);
  const [projectImage, setProjectImage] = React.useState<File | null>(null);
  const [bannerImage, setBannerImage] = React.useState<File | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const resetForm = () => {
    setName("");
    setDescription("");
    setColor(projectColors[0].id);
    setDueDate(undefined);
    setMembers([]);
    setProjectImage(null);
    setBannerImage(null);
    setError(null);
  }

  const handleClose = () => {
    resetForm();
    onClose();
  }

  const handleMemberSelection = (selectedIds: string[]) => {
      setMembers(selectedIds);
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("Project name is required.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let projectImageUrl: string | undefined = undefined;
      let bannerImageUrl: string | undefined = undefined;

      if (projectImage) {
        const res = await api.upload(projectImage, token);
        projectImageUrl = res.url;
      }
      if (bannerImage) {
        const res = await api.upload(bannerImage, token);
        bannerImageUrl = res.url;
      }

      const projectData = {
        name,
        description,
        color,
        dueDate: dueDate?.toISOString(),
        members,
        avatarUrl: projectImageUrl,
        bannerUrl: bannerImageUrl,
      };

      await api.post('/projects', projectData, token);

      // CAMBIO: Se llama a la función sin argumentos.
      onProjectCreated();
      handleClose();

    } catch (err: any) {
      setError(err.message || "Failed to create project.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-lg max-h-[90vh] flex flex-col p-0 glass-card">
        <DialogHeader className="p-6 pb-4 border-b border-border/50 flex-shrink-0">
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>Fill in the details to start your new project.</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Q4 Marketing Campaign" disabled={isLoading} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Add a short description..." disabled={isLoading} />
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
                    disabled={isLoading}
                  />
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Due Date (Optional)</Label>
              <DatePicker date={dueDate} onDateChange={setDueDate} />
            </div>
            <div className="space-y-2">
              <Label>Team Members</Label>
              <MemberSelector selectedMembers={members} onSelectMembers={handleMemberSelection} />
            </div>
            {error && <p className="text-sm text-center text-destructive">{error}</p>}
          </div>
        </div>

        <DialogFooter className="p-4 border-t border-border/50 flex-shrink-0">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}