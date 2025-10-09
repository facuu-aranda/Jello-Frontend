// Jello-Frontend/components/tasks/task-modal.tsx

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
import { TaskDetails, Label, Comment } from "@/types"
import { toast } from "sonner"
import { apiClient } from "@/lib/api"
import { useApi } from "@/hooks/useApi"
import { cn } from "@/lib/utils"
import { AttachmentViewerModal } from "../modals/AttachmentViewerModal"

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: TaskDetails | null;
  onDataChange?: () => void;
  showGoToProjectButton?: boolean;
}

export function TaskModal({ isOpen, onClose, task, onDataChange, showGoToProjectButton }: TaskModalProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [currentTask, setCurrentTask] = React.useState<TaskDetails | null>(task);

  const availableLabels = currentTask
    ? useApi<Label[]>(`/projects/${currentTask.projectId}/labels`).data
    : undefined;
  const [viewingAttachmentId, setViewingAttachmentId] = React.useState<string | null>(null);

  React.useEffect(() => {
    setCurrentTask(task);
    setIsEditing(false);
  }, [task]);

  // 2. Esta función ahora recibe el ID y lo guarda en el estado.
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

      // Actualización local inmediata del estado del modal
      setCurrentTask(prevTask => {
        if (!prevTask) return null;
        return {
          ...prevTask,
          comments: [...prevTask.comments, newComment]
        };
      });

      toast.success("Comment added!");

      // Refresca los datos de la página principal en segundo plano para actualizar contadores
      onDataChange?.();
    } catch (error) {
      toast.error(`Failed to add comment: ${(error as Error).message}`);
    }
  };
  // --- FIN DE LA CORRECCIÓN ---

  const handleSave = async () => {
    if (!currentTask) return;
    try {
      const payload = {
        title: currentTask.title,
        description: currentTask.description,
        labels: currentTask.labels.map(label => label._id)
      };
      await apiClient.put(`/projects/${currentTask.projectId}/tasks/${currentTask.id}`, payload);
      toast.success("Task updated successfully!");
      setIsEditing(false);
      onDataChange?.();
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

  const handleAttachmentAdd = async (files: FileList) => {
    if (!currentTask) return;
    toast.info(`Uploading ${files.length} file(s)...`);
    const uploadPromises = Array.from(files).map(file => {
      const formData = new FormData();
      formData.append('file', file);
      return apiClient.post(`/tasks/${currentTask.id}/attachments`, formData);
    });

    try {
      await Promise.all(uploadPromises);
      toast.success(`${files.length} file(s) uploaded.`);
      // Refresca la data de la tarea actual para mostrar los nuevos attachments
      const updatedTask = await apiClient.get<TaskDetails>(`/tasks/${currentTask.id}`);
      setCurrentTask(updatedTask);
      onDataChange?.(); // Actualiza la página principal en segundo plano
    } catch (error) {
      toast.error("Failed to upload attachments.");
      console.error(error);
    }
  };


  const handleAttachmentDelete = async (attachmentId: string) => {
    if (!currentTask) return;

    // 1. Filtra el adjunto a eliminar de la lista actual
    const updatedAttachments = currentTask.attachments.filter(
      (att) => att._id !== attachmentId
    );

    try {
      toast.info("Deleting attachment...");
      // 2. Llama al endpoint PUT de la tarea, enviando solo el array de adjuntos actualizado
      await apiClient.put(`/projects/${currentTask.projectId}/tasks/${currentTask.id}`, {
        attachments: updatedAttachments.map(att => att._id) // Enviamos solo los IDs
      });

      // 3. Actualiza el estado local del modal con la nueva lista de adjuntos
      setCurrentTask(prev => prev ? { ...prev, attachments: updatedAttachments } : null);

      toast.success("Attachment deleted.");

      // 4. Notifica a la página principal para que se refresque
      onDataChange?.();
    } catch (error) {
      toast.error(`Failed to delete attachment: ${(error as Error).message}`);
      // Nota: En un caso real, aquí se podría revertir el estado si la llamada falla.
    }
  };

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
                attachments={currentTask.attachments} 
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