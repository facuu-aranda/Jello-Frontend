
"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { X, Edit, ArrowRight, Tag } from "lucide-react"
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
import { TaskDetails, Label, Comment, Attachment, TaskPriority, UserSummary } from "@/types"; 

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: TaskDetails | null;
  onDataChange?: () => void;
  showGoToProjectButton?: boolean;
  projectMembers: UserSummary[];
}

export function TaskModal({ isOpen, onClose, task, onDataChange, showGoToProjectButton, projectMembers }: TaskModalProps) {
  const [isEditing, setIsEditing] = React.useState(false);
const [currentTask, setCurrentTask] = React.useState<TaskDetails | null>(task);
  const [newAttachments, setNewAttachments] = React.useState<File[]>([]);
  const [attachmentsToDelete, setAttachmentsToDelete] = React.useState<string[]>([]);

  const priorityOptions: { value: TaskPriority; label: string }[] = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' },
  ];

  const availableLabels = currentTask
    ? useApi<Label[]>(`/projects/${currentTask.projectId}/labels`).data
    : undefined;
  const [viewingAttachmentId, setViewingAttachmentId] = React.useState<string | null>(null);

  React.useEffect(() => {
    setCurrentTask(task);
    setIsEditing(false);
  }, [task]);

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

      onDataChange?.();
    } catch (error) {
      toast.error(`Failed to add comment: ${(error as Error).message}`);
    }
  };
  

const handleSave = async () => {
    if (!currentTask) return;
    toast.info("Saving task...");

    try {
        // 1. Subir nuevos archivos si los hay
        if (newAttachments.length > 0) {
            const uploadPromises = newAttachments.map(file => {
                const formData = new FormData();
                formData.append('file', file);
                return apiClient.post(`/tasks/${currentTask.id}/attachments`, formData); 
            });
            await Promise.all(uploadPromises);
        }

        // 2. Eliminar adjuntos marcados (si los hay)
        if (attachmentsToDelete.length > 0) {
            const deletePromises = attachmentsToDelete.map(id => 
                apiClient.del(`/tasks/${currentTask.id}/attachments/${id}`)
            );
            await Promise.all(deletePromises);
        }

        // 3. Guardar los demás datos de la tarea
        const payload = {
            title: currentTask.title,
            description: currentTask.description,
            labels: currentTask.labels.map(label => label._id),
            assignees: currentTask.assignees.map(a => a.id),
            priority: currentTask.priority,
            dueDate: currentTask.dueDate,
        };
        
        await apiClient.put(`/projects/${currentTask.projectId}/tasks/${currentTask.id}`, payload);

        toast.success("Task updated successfully!");
        setIsEditing(false);
        setNewAttachments([]); // Limpiar estado local
        setAttachmentsToDelete([]); // Limpiar estado local
        onDataChange?.(); // Refrescar la UI principal
    } catch (error) {
        toast.error(`Failed to save task: ${(error as Error).message}`);
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
        // Si es un archivo nuevo, solo lo quitamos del estado local
        const fileName = attachmentId.split('-')[1];
        setNewAttachments(prev => prev.filter(file => file.name !== fileName));
    } else {
        // Si es un archivo existente, lo marcamos para eliminar al guardar
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
      <Modal open={isOpen} onOpenChange={onClose}>
        <ModalContent className="max-h-screen overflow-hidden max-w-4xl p-0">
          <ModalHeader className="p-4 border-b border-border/50">
            <div className="flex items-center justify-between">
              {isEditing ? (
                <Input
                  value={currentTask.title}
                  onChange={(e) => setCurrentTask({ ...currentTask, title: e.target.value })}
                  className="text-lg font-semibold border-2 border-primary"
                />
              ) : (
                <h2 className="text-lg font-semibold text-foreground">{currentTask.title}</h2>
              )}

              <div className="flex items-center gap-2">
                {showGoToProjectButton && (
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/project/${currentTask.projectId}`}>
                      Go to project <ArrowRight className="w-3 h-3 ml-2" />
                    </Link>
                  </Button>
                )}

                {isEditing ? (
                  <>
                    <Button size="sm" onClick={handleSave}>Save</Button>
                    <Button size="sm" variant="ghost" onClick={() => {
                      setCurrentTask(task);
                      setIsEditing(false);
                    }}>Cancel</Button>
                  </>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}><Edit className="w-4 h-4 mr-2" /> Edit</Button>
                )}

                <Button variant="ghost" size="icon" onClick={onClose}><X className="w-4 h-4" /></Button>
              </div>
            </div>
          </ModalHeader>

          <div className="grid grid-cols-1 lg:grid-cols-3 max-h-[calc(100vh-80px)] overflow-y-auto">
            <div className="lg:col-span-2 space-y-6 p-6">
              <div className="space-y-3">
                <h4 className="font-medium text-foreground">Description</h4>
                {isEditing ? (
                  <Textarea
                    value={currentTask.description || ''}
                    onChange={(e) => setCurrentTask({ ...currentTask, description: e.target.value })}
                    className="min-h-[120px]"
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">{currentTask.description || "No description provided."}</p>
                )}
              </div>
              
               {isEditing && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pb-6 border-b">
                    {/* Asignados */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold flex items-center gap-2 text-muted-foreground"><User className="w-4 h-4" /> Assignees</h3>
                      <AssigneeSelector
                        projectMembers={projectMembers}
                        selectedAssignees={currentTask.assignees.map(a => a.id)}
                        onSelectionChange={(selectedIds) => {
                          const updatedAssignees = projectMembers.filter(m => selectedIds.includes(m.id));
                          setCurrentTask(prev => prev ? { ...prev, assignees: updatedAssignees } : null);
                        }}
                      />
                    </div>
                    {/* Fecha de Vencimiento */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold flex items-center gap-2 text-muted-foreground"><Calendar className="w-4 h-4" /> Due Date</h3>
                      <DatePicker
                        date={currentTask.dueDate ? new Date(currentTask.dueDate) : undefined}
                        setDate={(date) => setCurrentTask(prev => prev ? { ...prev, dueDate: date?.toISOString() ?? null } : null)}
                      />
                    </div>
                    {/* Prioridad */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold flex items-center gap-2 text-muted-foreground"><Flag className="w-4 h-4" /> Priority</h3>
                      <Select
                        value={currentTask.priority}
                        onValueChange={(priority: TaskPriority) => setCurrentTask(prev => prev ? { ...prev, priority } : null)}
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
                            className="cursor-pointer transition-all border-2 text-sm py-1 px-3"
                            style={{
                              backgroundColor: isSelected ? `${label.color}40` : 'transparent',
                              borderColor: label.color,
                              color: label.color,
                            }}
                            onClick={() => handleLabelToggle(label)}
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
              <SubtaskList subtasks={currentTask.subtasks} isEditing={isEditing} onSubtaskAdd={() => { }} onSubtaskDelete={() => { }} onSubtaskToggle={() => { }} />

              {/* --- INICIO DE LA CORRECCIÓN --- */}
              <CommentSection
                comments={currentTask.comments}
                taskId={currentTask.id}
                onSubmitComment={handleCommentSubmit}
              />
              {/* --- FIN DE LA CORRECCIÓN --- */}

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
      <AttachmentViewerModal 
        isOpen={!!viewingAttachmentId}
        onClose={() => setViewingAttachmentId(null)}
        attachments={currentTask.attachments}
        selectedAttachmentId={viewingAttachmentId}
      />
    </>
  )
}
