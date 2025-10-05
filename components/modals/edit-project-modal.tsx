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
import { ProjectSummary, UserSummary } from "@/types"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { ColorSelector } from "@/components/forms/color-selector"
import { ImageUploadField } from "@/components/forms/image-upload-field"
import { AddMemberModal } from "./AddMemberModal" 
import { UserPlus } from "lucide-react" 

interface ProjectFormData {
  name: string;
  description: string;
  color: string;
  projectImage?: File;
  bannerImage?: File;
  dueDate?: string;
}

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<ProjectFormData>) => void;
  onDelete: (id: string) => void;
  project: ProjectSummary;
  onDataChange: () => void; 
}

export function EditProjectModal({ isOpen, onClose, onSubmit, onDelete, project, onDataChange }: EditProjectModalProps) {
  const [formData, setFormData] = React.useState<Partial<ProjectFormData>>({});
  
  const [isInviteModalOpen, setIsInviteModalOpen] = React.useState(false);

  React.useEffect(() => {
    if (project) {
      setFormData({
        name: project.name,
        description: project.description,
        color: project.color,
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
  };
  
  // Cerramos ambos modales si el principal se cierra
  const handleClose = () => {
    setIsInviteModalOpen(false);
    onClose();
  }

   return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
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
              <Input id="name" name="name" value={formData.name || ''} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">Description</label>
              <Textarea id="description" name="description" value={formData.description || ''} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Team Members</label>
              <div className="flex items-center gap-2 flex-wrap p-2 bg-muted rounded-lg">
                {project.members.map((member: UserSummary) => (
                  <div key={member.id} className="flex items-center gap-2 p-1 bg-background rounded-full">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={member.avatarUrl || undefined} />
                      <AvatarFallback className="text-xs">{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm pr-2">{member.name}</span>
                  </div>
                ))}
                <Button type="button" size="icon" variant="ghost" className="rounded-full w-8 h-8" onClick={() => setIsInviteModalOpen(true)}>
                  <UserPlus className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <ImageUploadField 
                    label="Project Image" 
                    name="projectImage"
                    initialImage={project.projectImageUrl}
                    onChange={(file) => setFormData(prev => ({...prev, projectImage: file || undefined}))} 
                />
              </div>
              <div className="space-y-2">
                <ImageUploadField 
                    label="Banner Image" 
                    name="bannerImage" 
                    initialImage={project.bannerImageUrl}
                    onChange={(file) => setFormData(prev => ({...prev, bannerImage: file || undefined}))} 
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Project Color</label>
              <ColorSelector 
                  selectedColor={formData.color || ''} 
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

      {/* ✨ CORRECCIÓN: Usamos el nuevo AddMemberModal */}
      <AddMemberModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        projectId={project.id}
        onInviteSent={onDataChange}
        currentMembers={project.members.map(m => m.id)}
      />
    </>
  )
}