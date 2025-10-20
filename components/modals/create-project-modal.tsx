// components/modals/create-project-modal.tsx
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
import { ImageUploadField } from "@/components/forms/image-upload-field"
import { ColorSelector } from "@/components/forms/color-selector"
import { UserSummary } from "@/types"
import { UserPlus, X } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { UserSearchModal } from "./UserSearchModal" // Importamos el nuevo modal

// El tipo para el formulario que se envía
interface ProjectFormData {
  name: string;
  description: string;
  color: string;
  members: string[]; // Guardaremos solo los IDs de los miembros a invitar
  projectImage?: File;
  bannerImage?: File;
  dueDate?: string;
}

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<ProjectFormData>) => void;
}

const initialFormData: Partial<ProjectFormData> = {
  name: "",
  description: "",
  color: "bg-blue-500",
  members: [],
};

export function CreateProjectModal({ isOpen, onClose, onSubmit }: CreateProjectModalProps) {
  const [formData, setFormData] = React.useState<Partial<ProjectFormData>>(initialFormData);
  const [memberObjects, setMemberObjects] = React.useState<UserSummary[]>([]);
  const [isUserSearchModalOpen, setIsUserSearchModalOpen] = React.useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectUsers = (selectedUsers: UserSummary[]) => {
    // Evitar duplicados
    const newUsers = selectedUsers.filter(
      selected => !memberObjects.some(existing => existing.id === selected.id)
    );

    const newMemberObjects = [...memberObjects, ...newUsers];
    const newMemberIds = newMemberObjects.map(m => m.id);

    setMemberObjects(newMemberObjects);
    setFormData(prev => ({ ...prev, members: newMemberIds }));
    setIsUserSearchModalOpen(false);
  }
  
  const handleRemoveMember = (memberId: string) => {
    setMemberObjects(prev => prev.filter(m => m.id !== memberId));
    setFormData(prev => ({...prev, members: prev.members?.filter(id => id !== memberId)}));
  }

  const resetAndClose = () => {
    setFormData(initialFormData);
    setMemberObjects([]);
    onClose();
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    resetAndClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={resetAndClose}>
        <DialogContent className="sm:max-w-[525px] max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Fill in the details below to start a new project.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} id="create-project-form" className="flex-1 overflow-y-auto px-2">
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Project Name</label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">Description</label>
                <Textarea id="description" name="description" value={formData.description} onChange={handleChange} />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">Team Members</label>
                    <Button type="button" variant="ghost" size="sm" onClick={() => setIsUserSearchModalOpen(true)}>
                      <UserPlus className="w-4 h-4 mr-2" /> Add People
                    </Button>
                </div>
                <div className="flex items-center flex-wrap gap-2 min-h-[40px]">
                  {memberObjects.map((member) => (
                    <div key={member.id} className="relative group">
                      <Avatar title={member.name}>
                        <AvatarImage src={member.avatarUrl ?? undefined} alt={member.name} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <button 
                        type="button"
                        onClick={() => handleRemoveMember(member.id)}
                        className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label={`Remove ${member.name}`}
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  ))}
                  {memberObjects.length === 0 && <p className="text-xs text-muted-foreground">No members added yet.</p>}
                </div>
              </div>

              <div className="flex flex-col gap-2">
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
                    selectedColor={formData.color || 'bg-blue-500'} 
                    onSelectColor={(color: string) => setFormData(prev => ({ ...prev, color }))} 
                />
              </div>
            </div>
          </form>
          
          <DialogFooter className="flex-shrink-0 pt-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
            <Button type="button" variant="ghost" onClick={resetAndClose}>Cancel</Button>
            <Button type="submit" form="create-project-form">Create Project</Button>
          </DialogFooter>

        </DialogContent>
      </Dialog>
      
      <UserSearchModal
        isOpen={isUserSearchModalOpen}
        onClose={() => setIsUserSearchModalOpen(false)}
        onSelectUsers={handleSelectUsers}
        excludedUserIds={formData.members}
      />
    </>
  )
}