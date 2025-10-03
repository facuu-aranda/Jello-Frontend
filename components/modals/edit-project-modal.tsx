"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ProjectSummary } from "@/types"
import { MemberSelector } from "@/components/forms/member-selector"
import { ColorSelector } from "@/components/forms/color-selector"
import { ImageUploadField } from "@/components/forms/image-upload-field"

interface ProjectFormData {
  name: string;
  description: string;
  color: string;
  members: string[];
  projectImage?: File;
  bannerImage?: File;
  dueDate?: string;
}

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<ProjectFormData>) => void; // Partial, ya que no se edita todo
  onDelete: (id: string) => void;
  project: ProjectSummary;
}

export function EditProjectModal({ isOpen, onClose, onSubmit, onDelete, project }: EditProjectModalProps) {
  const [formData, setFormData] = React.useState({
    name: project.name,
    description: project.description,
    color: project.color,
    members: project.members.map(m => m.id),
  });

  React.useEffect(() => {
    if (project) {
      setFormData({
        name: project.name,
        description: project.description,
        color: project.color,
        members: project.members.map(m => m.id),
      });
    }
  }, [project]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription>
            Make changes to your project here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">Project Name</label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">Description</label>
            <Textarea id="description" name="description" value={formData.description} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Team Members</label>
            <MemberSelector 
              selectedMembers={formData.members}
              onSelectMembers={(ids) => setFormData(prev => ({ ...prev, members: ids }))} 
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <ImageUploadField 
                    label="Project Image" 
                    name="projectImage"
                    // Asumimos que `project` tiene `projectImageUrl` y `bannerImageUrl`
                    initialImage={(project as any).projectImageUrl}
                    onChange={(file) => setFormData(prev => ({...prev, projectImage: file || undefined}))} 
                />
              </div>
              <div className="space-y-2">
                <ImageUploadField 
                    label="Banner Image" 
                    name="bannerImage" 
                    initialImage={(project as any).bannerImageUrl}
                    onChange={(file) => setFormData(prev => ({...prev, bannerImage: file || undefined}))} 
                />
              </div>
          </div>
          <div className="space-y-2">
             <label className="text-sm font-medium">Project Color</label>
             <ColorSelector 
                selectedColor={formData.color} 
                onSelectColor={(color: string) => setFormData(prev => ({ ...prev, color }))} 
             />
          </div>
        </form>
        <DialogFooter className="flex justify-between w-full pt-4">
            <Button variant="destructive" onClick={() => onDelete(project.id)}>Delete Project</Button>
            <div>
                <Button variant="ghost" onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit}>Save changes</Button>
            </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}