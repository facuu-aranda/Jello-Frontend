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
import { MemberSelector } from "@/components/forms/member-selector"
import { ImageUploadField } from "@/components/forms/image-upload-field"
import { ColorSelector } from "@/components/forms/color-selector"

interface ProjectFormData {
  name: string;
  description: string;
  color: string;
  members: string[];
  projectImage?: File;
  bannerImage?: File;
  dueDate?: string;
}

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProjectFormData) => void;
}

export function CreateProjectModal({ isOpen, onClose, onSubmit }: CreateProjectModalProps) {
  const [formData, setFormData] = React.useState<ProjectFormData>({
    name: "",
    description: "",
    color: "bg-blue-500",
    members: [],
  });

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
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Fill in the details below to start a new project.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">Project Name</label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
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
                    onChange={(file) => setFormData(prev => ({...prev, projectImage: file || undefined}))} 
                />
              </div>
              <div className="space-y-2">
                <ImageUploadField 
                    label="Banner Image" 
                    name="bannerImage" 
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
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit">Create Project</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}