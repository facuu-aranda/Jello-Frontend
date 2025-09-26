"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { MemberSelector } from "@/components/forms/member-selector"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { ImageUploadField } from "@/components/forms/image-upload-field"
import { ProjectSummary, UserSummary } from "@/types" // <-- 1. Importar el tipo global

// 2. Definir una interfaz para los datos del formulario que puede ser diferente al de la API
interface ProjectFormData extends Omit<ProjectSummary, 'members'> {
    members: string[]; // En el formulario, manejamos los miembros por su ID
    projectImageFile?: File | null;
    bannerImageFile?: File | null;
}

interface EditProjectModalProps {
  isOpen: boolean; onClose: () => void;
  onSubmit: (data: FormData) => void; 
  onDelete: (id: string) => void;
  project: ProjectSummary | null;
}

const projectColors = [
    { id: 'bg-accent-pink', class: 'bg-accent-pink', selectedClass: 'ring-accent-pink' },
    { id: 'bg-accent-purple', class: 'bg-accent-purple', selectedClass: 'ring-accent-purple' },
    { id: 'bg-accent-teal', class: 'bg-accent-teal', selectedClass: 'ring-accent-teal' },
    { id: 'bg-primary', class: 'bg-primary', selectedClass: 'ring-primary' },
];

export function EditProjectModal({ isOpen, onClose, onSubmit, onDelete, project }: EditProjectModalProps) {
  const [formData, setFormData] = React.useState<ProjectFormData | null>(null);

  React.useEffect(() => {
    if (project) {
      setFormData({
        ...project,
        members: project.members.map((m: UserSummary) => m.id), // Extraemos los IDs para el selector
      });
    }
  }, [project]);

  if (!formData) return null;

  const handleChange = (field: keyof ProjectFormData, value: any) => {
    setFormData(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleSubmit = () => {
    if (formData) {
        const data = new FormData();
        const { projectImageFile, bannerImageFile, ...projectData } = formData;
        
        data.append('data', JSON.stringify(projectData));
        if (projectImageFile) data.append('projectImage', projectImageFile);
        if (bannerImageFile) data.append('bannerImage', bannerImageFile);

        onSubmit(data);
        onClose();
    }
  };
  
  const handleDelete = () => {
    if (formData) {
      onDelete(formData.id);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-lg max-h-[90vh] flex flex-col p-0 glass-card">
        <DialogHeader className="p-6 pb-4 border-b border-border/50 flex-shrink-0">
          <div className="flex justify-between items-center">
            <DialogTitle>Edit Project</DialogTitle>
            {formData.isOwner && (
                <Button variant="ghost" size="icon" onClick={handleDelete} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                    <Trash2 className="w-4 h-4" />
                </Button>
            )}
          </div>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto min-h-0">
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Project Name</Label>
                <Input id="name" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={formData.description} onChange={(e) => handleChange('description', e.target.value)} />
              </div>
              <ImageUploadField label="Project Image" name="projectImage" onChange={(file) => handleChange('projectImageFile', file)} />
              <ImageUploadField label="Project Banner" name="bannerImage" onChange={(file) => handleChange('bannerImageFile', file)} />
              <div className="space-y-2">
                <Label>Project Color</Label>
                <div className="flex gap-3">
                  {projectColors.map((c) => (
                    <button
                      key={c.id} type="button"
                      className={cn("w-8 h-8 rounded-full transition-transform hover:scale-110", c.class, formData.color === c.id && `ring-2 ${c.selectedClass} ring-offset-2 ring-offset-background`)}
                      onClick={() => handleChange('color', c.id)}
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Due Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !formData.dueDate && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.dueDate ? format(new Date(formData.dueDate), "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={formData.dueDate ? new Date(formData.dueDate) : undefined} onSelect={(date) => handleChange('dueDate', date?.toISOString())} initialFocus /></PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>Team Members</Label>
                <MemberSelector selectedMembers={formData.members} onSelectMembers={(ids) => handleChange('members', ids)} />
              </div>
            </div>
        </div>
        <DialogFooter className="p-4 border-t border-border/50 flex-shrink-0">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
