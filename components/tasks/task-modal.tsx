"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { X, Edit, ArrowRight, Tag, Loader2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Modal, ModalContent, ModalHeader } from "@/components/ui/modal"
import { SubtaskList } from "./subtask-list"
import { CommentSection } from "./comment-section"
import { AttachmentList } from "./attachment-list"
import { toast } from "sonner"
import { apiClient } from "@/lib/api"
import { useApi } from "@/hooks/useApi"
import { cn } from "@/lib/utils"
import { AttachmentViewerModal } from "../modals/AttachmentViewerModal"
import { User, Calendar, Flag } from "lucide-react"
import { DatePicker } from "@/components/ui/date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AssigneeSelector } from "../forms/assignee-selector";
import { TaskDetails, Label, Comment, Attachment, TaskPriority, UserSummary, Subtask } from "@/types"; 
import { DeleteTaskAlert } from "../modals/DeleteTaskAlert" 

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: TaskDetails | null;
  onDataChange?: () => void;
  onTaskDeleted?: () => void;
  showGoToProjectButton?: boolean;
  projectMembers: UserSummary[];
}

export function TaskModal({ isOpen, onClose, task, onDataChange, showGoToProjectButton, projectMembers }: TaskModalProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [currentTask, setCurrentTask] = React.useState<TaskDetails | null>(task);
  const [newAttachments, setNewAttachments] = React.useState<File[]>([]);
  const [attachmentsToDelete, setAttachmentsToDelete] = React.useState<string[]>([]);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = React.useState(false); 
  
  const priorityOptions: { value: TaskPriority; label: string }[] = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' },
  ];
  
  const labelsEndpoint = currentTask ? `/projects/${currentTask.projectId}/labels` : null;
  const { data: availableLabels } = useApi<Label[] | null>(labelsEndpoint);

  const [viewingAttachmentId, setViewingAttachmentId] = React.useState<string | null>(null);

  React.useEffect(() => {
    setCurrentTask(task);
    setIsEditing(false);
  }, [task]);

  // --- CORRECCIÓN 1: 'handleCloseAndRefetch' ELIMINADA ---
  // Ya no necesitamos esta función. Usaremos 'onClose' directamente.

  const handleCancelEdit = () => {
    setCurrentTask(task);
    setNewAttachments([]);
    setAttachmentsToDelete([]);
    setIsEditing(false);
  }

  const handleViewAttachment = (attachmentId: string) => {
    setViewingAttachmentId(attachmentId);
  };

  const handleCommentSubmit = async (content: string, attachmentFile: File | null) => {
    if (!currentTask) return;
    if (!content.trim() && !attachmentFile) return;

    const formData = new FormData();
    formData.append('content', content);
    if (attachmentFile) {
      formData.append('attachment', attachmentFile);
    }

    try {
      toast.info("Adding comment...");
      const newComment = await apiClient.post<Comment>(`/tasks/${currentTask.id}/comments`, formData);
      setCurrentTask(prevTask => {
        if (!prevTask) return null;
        return {
          ...prevTask,
          comments: [...prevTask.comments, newComment]
        };
      });
      toast.success("Comment added!");
    } catch (error) {
      toast.error(`Failed to add comment: ${(error as Error).message}`);
    }
  };
  
  const handleSubtaskAdd = (text: string) => {
    if (!currentTask || !text.trim()) return;
    const newSubtask: Subtask = {
        id: `temp-${Date.now()}`,
        text: text,
        completed: false
    };
    setCurrentTask(prevTask => {
        if (!prevTask) return null;
        return {
            ...prevTask,
            subtasks: [...prevTask.subtasks, newSubtask]
        };
    });
  };


  const handleSubtaskToggle = (subtaskId: string, completed: boolean) => {
    if (!currentTask) return;
    setCurrentTask(prevTask => {
        if (!prevTask) return null;
        return {
            ...prevTask,
            subtasks: prevTask.subtasks.map(sub =>
                sub.id === subtaskId ? { ...sub, completed } : sub
            )
        };
    });
  };

  const handleSubtaskDelete = (subtaskId: string) => {
    if (!currentTask) return;
    setCurrentTask(prevTask => {
        if (!prevTask) return null;
        return {
            ...prevTask,
            subtasks: prevTask.subtasks.filter(sub => sub.id !== subtaskId)
        };
    });
  };

 const handleDeleteTask = async () => {
    if (!currentTask || isSaving) return;
    setIsSaving(true);
    const toastId = toast.loading("Deleting task...");
    
    try {
        await apiClient.del(`/projects/${currentTask.projectId}/tasks/${currentTask.id}`); 
        
        toast.success("Task deleted successfully!", { id: toastId });
        setIsDeleteAlertOpen(false);
        onClose(); 
        onDataChange?.(); 
    } catch (error) {
        toast.error(`Failed to delete task: ${(error as Error).message}`, { id: toastId });
    } finally {
        setIsSaving(false);
    }
  };

  const handleSave = async () => {
    if (!currentTask || isSaving) return;
    
    setIsSaving(true);
    const toastId = toast.loading("Saving task changes...");
    
    try {
        // 1. Guardar la tarea principal (título, labels, etc.) PRIMERO
        const payload = {
            title: currentTask.title,
            description: currentTask.description,
            labels: currentTask.labels.map(label => label._id),
            assignees: currentTask.assignees.map(a => a.id),
            priority: currentTask.priority,
            dueDate: currentTask.dueDate,
        };
        await apiClient.put(`/projects/${currentTask.projectId}/tasks/${currentTask.id}`, payload);
        toast.info("Task details saved...", { id: toastId });

        // 2. Preparar listas de cambios para Subtareas
        const originalSubtasks = task?.subtasks || [];
        const newSubtasks = currentTask.subtasks || [];
        const addedSubtasks = newSubtasks.filter(s => s.id.startsWith('temp-'));
        const deletedSubtasks = originalSubtasks.filter(os => !newSubtasks.some(s => s.id === os.id));
        const modifiedSubtasks = newSubtasks.filter(s => {
            if (s.id.startsWith('temp-')) return false;
            const original = originalSubtasks.find(os => os.id === s.id);
            return original && original.completed !== s.completed;
        });

        // 3. Preparar promesas de Subtareas
        const subtaskPromises: Promise<any>[] = [];
        addedSubtasks.forEach(s => subtaskPromises.push(apiClient.post(`/tasks/${currentTask.id}/subtasks`, { text: s.text })));
        deletedSubtasks.forEach(s => subtaskPromises.push(apiClient.del(`/tasks/${currentTask.id}/subtasks/${s.id}`)));
        modifiedSubtasks.forEach(s => subtaskPromises.push(apiClient.put(`/tasks/${currentTask.id}/subtasks/${s.id}`, { completed: s.completed })));
        
        await Promise.all(subtaskPromises);
        if (subtaskPromises.length > 0) toast.info("Subtasks updated...", { id: toastId });
        
        // 4. Preparar promesas de Attachments
        const attachmentPromises: Promise<any>[] = [];
        newAttachments.forEach(file => {
            const formData = new FormData();
            formData.append('file', file);
            attachmentPromises.push(apiClient.post(`/tasks/${currentTask.id}/attachments`, formData));
        });
        attachmentsToDelete.forEach(id => {
            attachmentPromises.push(apiClient.del(`/tasks/${currentTask.id}/attachments/${id}`));
        });

        await Promise.all(attachmentPromises);
        if (attachmentPromises.length > 0) toast.info("Attachments updated...", { id: toastId });

        // --- CORRECCIÓN 3: Refrescar y Cerrar al final ---
        onDataChange?.(); // Refresca la página principal
        setNewAttachments([]);
        setAttachmentsToDelete([]);
        setIsEditing(false); 
        toast.success("Task updated successfully!", { id: toastId });
        
        onClose(); // Llama a onClose al final para cerrar el modal y limpiar la URL
        // --- FIN CORRECCIÓN 3 ---

    } catch (error) {
        toast.error(`Failed to save task: ${(error as Error).message}`, { id: toastId });
    } finally {
        setIsSaving(false);
    }
  };
  
  const handleLabelToggle = (labelToToggle: Label) => {
    if (!currentTask || !isEditing) return;
    setCurrentTask(prevTask => {
      if (!prevTask) return null;
      const isSelected = prevTask.labels.some(l => l._id === labelToToggle._id);
      const newLabels = isSelected
        ? prevTask.labels.filter(l => l._id !== labelToToggle._id)
        : [...prevTask.labels, labelToToggle];
      return { ...prevTask, labels: newLabels };
    });
  };

  const handleAttachmentAdd = (files: FileList) => {
    setNewAttachments(prev => [...prev, ...Array.from(files)]);
  };

  const handleAttachmentDelete = (attachmentId: string) => {
    if (attachmentId.startsWith('new-')) {
        const fileName = attachmentId.split('-')[1];
        setNewAttachments(prev => prev.filter(file => file.name !== fileName));
    } else {
        setAttachmentsToDelete(prev => [...prev, attachmentId]);
    }
  };

  const allAttachmentsForUI: Attachment[] = React.useMemo(() => [
    ...(currentTask?.attachments.filter(att => !attachmentsToDelete.includes(att._id)) || []),
    ...newAttachments.map((file, index) => ({
    _id: `new-${file.name}-${index}`,
    name: file.name,
    url: URL.createObjectURL(file),
    size: `${(file.size / 1024).toFixed(1)} KB`,
    type: file.type.startsWith('image/') ? "image" as "image" : "document" as "document",
  }))
  ], [currentTask?.attachments, newAttachments, attachmentsToDelete]);

  if (!isOpen || !currentTask) {
    return null;
  }
  
  return (
    <>
      {/* --- CORRECCIÓN 2: Usar 'onClose' para 'onOpenChange' --- */}
      <Modal open={isOpen} onOpenChange={onClose}>
        <ModalContent className="max-h-screen overflow-hidden max-w-4xl p-0">
          <ModalHeader className="p-4 border-b border-border/50">
            <div className="flex items-center justify-between">
              {isEditing ? (
                <Input
                   value={currentTask.title}
                  onChange={(e) => setCurrentTask({ ...currentTask, title: e.target.value })}
                  className="text-lg font-semibold border-2 border-primary"
                  disabled={isSaving}
                />
              ) : (
                <h2 className="text-lg font-semibold truncate text-foreground">{currentTask.title}</h2>
              )}

              <div className="flex items-center gap-2">
                {showGoToProjectButton && !isEditing && (
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/project/${currentTask.projectId}`}>
                       Go to project <ArrowRight className="w-3 h-3 ml-2" />
                    </Link>
                  </Button>
                )}

                {isEditing ?
                (
                  <>
                    <Button size="sm" onClick={handleSave} disabled={isSaving}>
                      {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      Save
                    </Button>
                    <Button size="sm" variant="ghost" onClick={handleCancelEdit} disabled={isSaving}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                    <Edit className="w-4 h-4 mr-2" /> Edit
                  </Button>
                )}
                
                {/* --- CORRECCIÓN 2: Usar 'onClose' para el botón 'X' --- */}
                <Button variant="ghost" size="icon" onClick={onClose} disabled={isSaving}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </ModalHeader>

          <div className="grid grid-cols-1 lg:grid-cols-3 max-h-[calc(100vh-80px)] overflow-y-auto">
            <div className="lg:col-span-2 space-y-6 p-6">
               <div className="space-y-3">
                <h4 className="font-medium text-foreground">Descripcion</h4>
                {isEditing ?
                (
                  <Textarea
                    value={currentTask.description || ''}
                    onChange={(e) => setCurrentTask({ ...currentTask, description: e.target.value })}
                    className="min-h-[120px]"
                    disabled={isSaving}
                   />
                ) : (
                  <p className="text-sm break-words h-32 overflow-y-auto text-muted-foreground">{currentTask.description || "No description provided."}</p>
                )}
              </div>
              
               {isEditing && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pb-6 border-b">
                    <div className="space-y-2">
                       <h3 className="text-sm font-semibold flex items-center gap-2 text-muted-foreground"><User className="w-4 h-4" /> Assignees</h3>
                      <AssigneeSelector
                        projectMembers={projectMembers}
                        selectedAssignees={currentTask.assignees.map(a => a.id)}
                         onSelectionChange={(selectedIds) => {
                          if (isSaving) return;
                          const updatedAssignees = projectMembers.filter(m => selectedIds.includes(m.id));
                          setCurrentTask(prev => prev ? { ...prev, assignees: updatedAssignees } : null);
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                       <h3 className="text-sm font-semibold flex items-center gap-2 text-muted-foreground"><Calendar className="w-4 h-4" /> Due Date</h3>
                      <DatePicker
                        date={currentTask.dueDate ? new Date(currentTask.dueDate) : undefined}
                        setDate={(date) => setCurrentTask(prev => prev ? { ...prev, dueDate: date?.toISOString() ?? null } : null)}
                      />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold flex items-center gap-2 text-muted-foreground"><Flag className="w-4 h-4" /> Priority</h3>
                      <Select
                         value={currentTask.priority}
                        onValueChange={(priority: TaskPriority) => setCurrentTask(prev => prev ? { ...prev, priority } : null)}
                        disabled={isSaving}
                      >
                        <SelectTrigger>
                           <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          {priorityOptions.map(opt => (
                             <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                     </div>
                  </div>
                )}

              {(isEditing || (currentTask.labels && currentTask.labels.length > 0)) && (
                <div className="space-y-3">
                  <h4 className="font-medium text-foreground flex items-center gap-2"><Tag className="w-4 h-4" />Labels</h4>
                  <div className="flex flex-wrap gap-2">
                    {isEditing ? (
                       availableLabels?.map((label: Label) => {
                        const isSelected = currentTask.labels.some(l => l._id === label._id);
                        return (
                          <Badge
                             key={label._id}
                            variant={"outline"}
                            className={cn(
                              "cursor-pointer transition-all border-2 text-sm py-1 px-3",
                              isSaving && "opacity-50 cursor-not-allowed"
                            )}
                             style={{
                              backgroundColor: isSelected ? `${label.color}40` : 'transparent',
                              borderColor: label.color,
                              color: label.color,
                            }}
                            onClick={() => !isSaving && handleLabelToggle(label)}
                          >
                             {label.name}
                          </Badge>
                        )
                      })
                     ) : (
                      currentTask.labels.map((label: Label) => (
                        <Badge key={label._id} variant="secondary" className="text-sm py-1 px-3" style={{ backgroundColor: label.color + "20", color: label.color }}>
                           {label.name}
                        </Badge>
                      ))
                    )}
                  </div>
                 </div>
              )}
              
              <SubtaskList
                subtasks={currentTask.subtasks}
                isEditing={isEditing}
                onSubtaskAdd={handleSubtaskAdd}
                onSubtaskDelete={handleSubtaskDelete}
                onSubtaskToggle={handleSubtaskToggle}
              />


              <CommentSection
                comments={currentTask.comments}
                taskId={currentTask.id}
                 onSubmitComment={handleCommentSubmit}
              />

              {/* Botón de Eliminar Tarea */}
              {isEditing && (
                <div className="space-y-3 pt-6 border-t border-destructive/20">
                  <h4 className="font-medium text-destructive">Danger Zone</h4>
                   <Button 
                    variant="destructive" 
                    className="w-full sm:w-auto"
                    onClick={() => setIsDeleteAlertOpen(true)}
                    disabled={isSaving}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete this task
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Esta acción no se puede deshacer.
                  </p>
                </div>
              )}

            </div>
            <div className="lg:col-span-1 lg:border-l border-border/50 p-6 space-y-6">
              <AttachmentList 
                attachments={allAttachmentsForUI} 
                 isEditing={isEditing} 
                taskId={currentTask.id}
                onAttachmentAdd={handleAttachmentAdd}
                onAttachmentDelete={handleAttachmentDelete}
                onAttachmentView={handleViewAttachment}
              />
            </div>
           </div>
        </ModalContent>
      </Modal>
      
      {/* Modal de Alerta de Eliminación */}
      <DeleteTaskAlert 
        isOpen={isDeleteAlertOpen}
        onClose={() => setIsDeleteAlertOpen(false)}
        onConfirmDelete={handleDeleteTask}
      />

      <AttachmentViewerModal 
        isOpen={!!viewingAttachmentId}
        onClose={() => setViewingAttachmentId(null)}
        attachments={currentTask.attachments}
        selectedAttachmentId={viewingAttachmentId}
      />
    </>
  )
}