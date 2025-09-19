"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { MemberSelector } from "@/components/forms/member-selector"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { ImageUploadField } from "@/components/forms/image-upload-field"
import { DatePicker } from "../ui/date-picker"
import { useAuth } from "@/contexts/AuthContext"
import { api } from "@/lib/api/client"
import { Project, ProjectMember, User } from "@/lib/api/types"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog"

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectUpdated: () => void;
  onProjectDeleted: () => void;
  project: Project | null;
}

const projectColors = [
  { id: 'bg-accent-pink', class: 'bg-accent-pink', selectedClass: 'ring-accent-pink' },
  { id: 'bg-accent-purple', class: 'bg-accent-purple', selectedClass: 'ring-accent-purple' },
  { id: 'bg-accent-teal', class: 'bg-accent-teal', selectedClass: 'ring-accent-teal' },
  { id: 'bg-primary', class: 'bg-primary', selectedClass: 'ring-primary' },
];

export function EditProjectModal({ isOpen, onClose, onProjectUpdated, onProjectDeleted, project }: EditProjectModalProps) {
  const { token } = useAuth();
  const [formData, setFormData] = React.useState<Project | null>(project);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (project) setFormData(project);
  }, [project]);

  if (!formData) return null;

  const handleChange = (field: keyof Project, value: any) => {
    setFormData(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleMemberSelection = (selectedIds: string[]) => {
    // Esto es simplificado. Una implementación real necesitaría obtener los objetos de usuario
    // o el backend debería poder aceptar solo los IDs. Por ahora, creamos una estructura parcial.
    const newMembers: ProjectMember[] = selectedIds.map(id => {
        const existingMember = formData.members.find(m => m.user.id === id);
        return existingMember || { user: { id, name: '...' }, role: 'member' };
    });
    handleChange('members', newMembers);
  };
  
  const handleFileChange = (field: 'avatarUrl' | 'bannerUrl', file: File | null) => {
    setFormData(prev => prev ? { ...prev, [field]: file as any } : null);
  }

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      setError("Project name is required.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const { members, ...restOfData } = formData;
      const memberIds = members.map(m => m.user.id);

      const updatePayload: Omit<Partial<Project>, "members"> & { members: string[] } = { 
        ...restOfData,
        members: memberIds
      };

      if (updatePayload.avatarUrl && typeof updatePayload.avatarUrl !== 'string') {
        const res = await api.upload(updatePayload.avatarUrl as any, token);
        updatePayload.avatarUrl = res.url;
      }
      if (updatePayload.bannerUrl && typeof updatePayload.bannerUrl !== 'string') {
        const res = await api.upload(updatePayload.bannerUrl as any, token);
        updatePayload.bannerUrl = res.url;
      }

      await api.put(`/projects/${formData.id}`, updatePayload, token);
      onProjectUpdated();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to update project.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await api.delete(`/projects/${formData.id}`, token);
      onProjectDeleted();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to delete project.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-lg max-h-[90vh] flex flex-col p-0 glass-card">
        <DialogHeader className="p-6 pb-4 border-b border-border/50 flex-shrink-0">
          <div className="flex justify-between items-center">
            <DialogTitle>Edit Project</DialogTitle>
            {formData.isOwner && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the project and all of its data.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name</Label>
              <Input id="name" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} disabled={isLoading} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={formData.description} onChange={(e) => handleChange('description', e.target.value)} disabled={isLoading} />
            </div>
            <ImageUploadField label="Project Image" name="projectImage" onChange={(file) => handleFileChange('avatarUrl', file)} currentImageUrl={typeof formData.avatarUrl === 'string' ? formData.avatarUrl : undefined} />
            <ImageUploadField label="Project Banner" name="bannerImage" onChange={(file) => handleFileChange('bannerUrl', file)} currentImageUrl={typeof formData.bannerUrl === 'string' ? formData.bannerUrl : undefined} />
            <div className="space-y-2">
              <Label>Project Color</Label>
              <div className="flex gap-3">
                {projectColors.map((c) => (
                  <button
                    key={c.id} type="button"
                    className={cn("w-8 h-8 rounded-full transition-transform hover:scale-110", c.class, formData.color === c.id && `ring-2 ${c.selectedClass} ring-offset-2 ring-offset-background`)}
                    onClick={() => handleChange('color', c.id)}
                    disabled={isLoading}
                  />
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Due Date</Label>
              <DatePicker
                date={formData.dueDate ? new Date(formData.dueDate) : undefined}
                onDateChange={(date) => handleChange('dueDate', date?.toISOString())}
              />
            </div>
            <div className="space-y-2">
              <Label>Team Members</Label>
              {/* 👇 --- CORRECCIÓN CRÍTICA AQUÍ --- 👇 */}
              <MemberSelector selectedMembers={formData.members.map(m => m.user.id)} onSelectMembers={handleMemberSelection} />
            </div>
            {error && <p className="text-sm text-center text-destructive">{error}</p>}
          </div>
        </div>
        <DialogFooter className="p-4 border-t border-border/50 flex-shrink-0">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isLoading}>{isLoading ? "Saving..." : "Save Changes"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}