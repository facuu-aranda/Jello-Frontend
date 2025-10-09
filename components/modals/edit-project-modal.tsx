// components/modals/edit-project-modal.tsx
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
import { ProjectSummary, UserSummary, Label as LabelType } from "@/types"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { ColorSelector } from "@/components/forms/color-selector"
import { ImageUploadField } from "@/components/forms/image-upload-field"
import { UserSearchModal } from "./UserSearchModal" // 1. Usamos el nuevo modal de búsqueda
import { UserPlus } from "lucide-react"
import { LabelManager } from "@/components/forms/label-manager"
import { apiClient } from "@/lib/api"
import { toast } from "sonner"

// Definimos una interfaz para el formulario
interface ProjectFormData {
  name: string;
  description: string;
  color: string;
  projectImage?: File;
  bannerImage?: File;
  dueDate?: string;
}

// Props del componente
interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  onDelete: (id: string) => void;
  project: ProjectSummary;
  onDataChange: () => void; // Para refrescar la UI principal
}

const COLORS = ["#ef4444", "#f97316", "#eab308", "#84cc16", "#22c55e", "#14b8a6", "#06b6d4", "#3b82f6", "#8b5cf6", "#d946ef", "#ec4899"];
const getRandomColor = () => COLORS[Math.floor(Math.random() * COLORS.length)];

export function EditProjectModal({ isOpen, onClose, onSubmit, onDelete, project, onDataChange }: EditProjectModalProps) {
  const [formData, setFormData] = React.useState<ProjectFormData>({ name: '', description: '', color: '' });
  const [isUserSearchModalOpen, setIsUserSearchModalOpen] = React.useState(false);
  const [currentMembers, setCurrentMembers] = React.useState<UserSummary[]>([]);

  // --- 2. Estado centralizado para la gestión de Labels ---
  const [projectLabels, setProjectLabels] = React.useState<LabelType[]>([]);
  const [labelsToAdd, setLabelsToAdd] = React.useState<string[]>([]);
  const [labelsToDelete, setLabelsToDelete] = React.useState<string[]>([]);

  React.useEffect(() => {
    // Cuando el modal se abre y tenemos un proyecto, cargamos sus datos
    if (project && isOpen) {
      setFormData({
        name: project.name,
        description: project.description,
        color: project.color,
        dueDate: project.dueDate || undefined,
      });
      setCurrentMembers(project.members);
      
      // Cargamos los labels actuales del proyecto desde la API
      apiClient.get<LabelType[]>(`/projects/${project.id}/labels`)
        .then(setProjectLabels)
        .catch(() => toast.error("Could not load project labels."));
    } else {
      // Limpiamos el estado cuando el modal se cierra
      setProjectLabels([]);
      setLabelsToAdd([]);
      setLabelsToDelete([]);
    }
  }, [project, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- 3. Funciones para gestionar el estado local de los labels ---
  const handleLabelAdd = (name: string) => {
    if (projectLabels.some(l => l.name.toLowerCase() === name.toLowerCase()) || labelsToAdd.includes(name)) {
      toast.error("A label with that name already exists.");
      return;
    }
    // Añadimos el nombre a la lista de "nuevos"
    setLabelsToAdd(prev => [...prev, name]);
    // Actualizamos la UI inmediatamente para que el usuario lo vea
    setProjectLabels(prev => [...prev, { _id: `temp-${name}`, name, color: getRandomColor() }]);
  };

  const handleLabelDelete = (id: string) => {
    const labelToRemove = projectLabels.find(l => l._id === id);
    if (!labelToRemove) return;

    // Si es un label ya existente en el backend, lo marcamos para borrar
    if (!id.startsWith('temp-')) {
      setLabelsToDelete(prev => [...prev, id]);
    }
    
    // Si era un label que acabábamos de añadir, lo quitamos de la lista de "nuevos"
    setLabelsToAdd(prev => prev.filter(name => name !== labelToRemove.name));
    
    // Actualizamos la UI para que desaparezca
    setProjectLabels(prev => prev.filter(l => l._id !== id));
  };
  
  // --- 4. Lógica de guardado centralizada ---
  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.info("Saving project changes...");

    // Primero, guardamos los cambios de los labels en un solo batch
    if (labelsToAdd.length > 0 || labelsToDelete.length > 0) {
      try {
        await apiClient.put(`/projects/${project.id}/labels/batch`, {
          add: labelsToAdd.map(name => ({ name, color: getRandomColor() })),
          delete: labelsToDelete,
        });
        // Limpiamos los arrays de cambios pendientes
        setLabelsToAdd([]);
        setLabelsToDelete([]);
      } catch (err) {
        toast.error(`Failed to update labels: ${(err as Error).message}`);
        return; // Detenemos la ejecución si los labels fallan
      }
    }

    // Segundo, preparamos y enviamos los demás datos del proyecto
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('color', formData.color);
    if (formData.projectImage) data.append('projectImage', formData.projectImage);
    if (formData.bannerImage) data.append('bannerImage', formData.bannerImage);
    
    // La función onSubmit, pasada como prop, se encarga de la llamada final y de cerrar el modal
    onSubmit(data);
  };
  
  // Función para invitar a los nuevos miembros seleccionados
  const handleInviteUsers = async (selectedUsers: UserSummary[]) => {
    setIsUserSearchModalOpen(false);
    if (selectedUsers.length === 0) return;

    toast.info(`Inviting ${selectedUsers.length} member(s)...`);
    
    const invitePromises = selectedUsers.map(user => 
      apiClient.post(`/projects/${project.id}/invitations`, { userIdToInvite: user.id })
    );

    try {
      await Promise.all(invitePromises);
      toast.success("Invitations sent successfully!");
      onDataChange(); // Refresca los datos para mostrar los miembros nuevos o pendientes
    } catch (error) {
      toast.error(`Failed to send invitations: ${(error as Error).message}`);
    }
  }

  if (!project) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[525px] max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>
              Make changes to your project here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto pr-2 -mr-6 pl-6">
            <form id="edit-project-form" onSubmit={handleSaveChanges} className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Project Name</label>
                <Input name="name" value={formData.name} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea name="description" value={formData.description} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">Team Members</label>
                  <Button type="button" variant="ghost" size="sm" onClick={() => setIsUserSearchModalOpen(true)}>
                    <UserPlus className="w-4 h-4 mr-2" /> Invite
                  </Button>
                </div>
                <div className="flex items-center flex-wrap gap-2">
                  {currentMembers.map((member: UserSummary) => (
                    <Avatar key={member.id} title={member.name}>
                      <AvatarImage src={member.avatarUrl ?? undefined} alt={member.name} />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                  <label className="text-sm font-medium">Project Labels</label>
                  <LabelManager 
                    projectId={project.id}
                    onDataChange={onDataChange} 
                  />
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
          </div>
          <DialogFooter className="flex-shrink-0 pt-4 flex-nowrap justify-between w-full">
              <Button variant="destructive" onClick={() => onDelete(project.id)}>Delete Project</Button>
              <div className="flex gap-2">
                  <Button variant="ghost" onClick={onClose}>Cancel</Button>
                  <Button type="submit" form="edit-project-form">Save changes</Button>
              </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <UserSearchModal
        isOpen={isUserSearchModalOpen}
        onClose={() => setIsUserSearchModalOpen(false)}
        onSelectUsers={handleInviteUsers}
        excludedUserIds={currentMembers.map(m => m.id)}
      />
    </>
  )
}