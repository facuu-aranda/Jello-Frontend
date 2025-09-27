"use client"
import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { X, Calendar, Flag, Trash2, Edit, ArrowRight } from "lucide-react"
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

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: TaskDetails | null;
  onSubmit?: (taskData: Partial<TaskDetails>) => void;
  onDelete?: (taskId: string) => void;
  showGoToProjectButton?: boolean;
  mode?: "view" | "edit";
  onDataChange?: () => void;
}

const availableLabels: Label[] = [
  { id: "1", name: "Design", color: "#ec4899" },
  { id: "2", name: "Frontend", color: "#8b5cf6" },
  { id: "3", name: "Backend", color: "#14b8a6" },
  { id: "4", name: "Bug", color: "#be123c" },
  { id: "5", name: "Feature", color: "#00a3e0" },
  { id: "6", name: "Marketing", color: "#ff6f61" },
];

export function TaskModal({ isOpen, onClose, task, onSubmit, onDelete, showGoToProjectButton = false, mode = "view", onDataChange }: TaskModalProps) {
  const [currentTask, setCurrentTask] = React.useState<TaskDetails | null>(task);
  const [isEditing, setIsEditing] = React.useState(mode === "edit");

  React.useEffect(() => {
    if (isOpen) {
      setCurrentTask(task);
      setIsEditing(mode === "edit");
    }
  }, [isOpen, task, mode]);

  const handleSave = () => { if (currentTask) onSubmit?.(currentTask); setIsEditing(false); }
  const handleDelete = () => { if (currentTask?.id && onDelete) { onDelete(currentTask.id); onClose(); } }
  
  const handleLabelToggle = (label: Label) => {
    if (!currentTask) return;
    const newLabels = currentTask.labels.some((l) => l.id === label.id)
      ? currentTask.labels.filter((l) => l.id !== label.id)
      : [...currentTask.labels, label];
    setCurrentTask({ ...currentTask, labels: newLabels });
  }

  const handleUpdateField = <K extends keyof TaskDetails>(field: K, value: TaskDetails[K]) => {
    setCurrentTask(prev => prev ? { ...prev, [field]: value } : null);
  }

  const handleAttachmentAdd = (files: FileList) => { toast.info("Attachment upload not implemented yet.") };
  const handleAttachmentDelete = (id: string) => { toast.info("Attachment deletion not implemented yet.") };

  if (!isOpen || !currentTask) return null;

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent className="w-[95vw] max-w-4xl max-h-[90vh] grid grid-rows-[auto,1fr] p-0 overflow-hidden glass-card">
        <ModalHeader className="flex-shrink-0 border-b border-border/50 px-6 pt-6 pb-4">
            <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                    {isEditing ? (
                        /* CORRECCIÓN: Se añade el tipo explícito al evento del onChange */
                        <Input value={currentTask.title} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleUpdateField('title', e.target.value)} className="text-xl font-bold h-auto p-0 border-none focus-visible:ring-0" />
                    ) : (
                        <h2 className="text-xl font-bold text-foreground truncate">{currentTask.title}</h2>
                    )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    {isEditing ? (
                        <Button size="sm" onClick={handleSave}>Save</Button>
                    ) : (
                        <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}><Edit className="w-4 h-4 mr-2" />Edit</Button>
                    )}
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={handleDelete}><Trash2 className="w-4 h-4" /></Button>
                    {showGoToProjectButton && <Button asChild size="sm" variant="outline"><Link href={`/project/${currentTask.projectId}`}>Go to Project <ArrowRight className="w-4 h-4 ml-2" /></Link></Button>}
                    <Button variant="ghost" size="icon" onClick={onClose}><X className="w-4 h-4" /></Button>
                </div>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground mt-2">
                <div className="flex items-center gap-2"><Flag className="w-4 h-4" /><span>{currentTask.priority}</span></div>
                <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /><span>{currentTask.dueDate ? new Date(currentTask.dueDate).toLocaleDateString() : 'No due date'}</span></div>
            </div>
        </ModalHeader>
        <div className="overflow-y-auto grid lg:grid-cols-3 min-h-0">
          <div className="lg:col-span-2 space-y-6 p-6">
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Description</h4>
              {isEditing ? (<Textarea value={currentTask.description || ''} onChange={(e) => handleUpdateField('description', e.target.value)} className="min-h-[100px]" />) : (<p className="text-sm text-muted-foreground">{currentTask.description || "No description provided."}</p>)}
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Labels</h4>
              <div className="flex flex-wrap gap-2">
                {isEditing ? (
                  availableLabels.map(label => {
                    const isSelected = currentTask.labels.some((l) => l.id === label.id);
                    return (
                      <Badge key={label.id} variant={"outline"} className="cursor-pointer transition-all border-2 text-sm py-1 px-3"
                        style={{ backgroundColor: isSelected ? `${label.color}40` : 'transparent', color: label.color, borderColor: label.color }}
                        onClick={() => handleLabelToggle(label)}>
                        {label.name}
                      </Badge>
                    )
                  })
                ) : (
                  currentTask.labels.map((label: Label) => (
                    <Badge key={label.id} variant="secondary" className="text-sm py-1 px-3" style={{ backgroundColor: label.color + "20", color: label.color }}>
                      {label.name}
                    </Badge>
                  ))
                )}
              </div>
            </div>
            <SubtaskList subtasks={currentTask.subtasks} isEditing={isEditing} onSubtaskAdd={() => { }} onSubtaskDelete={() => { }} onSubtaskToggle={() => {}} />
            <CommentSection comments={currentTask.comments} onCommentAdd={() => {}} />
          </div>
          <div className="lg:col-span-1 lg:border-l border-border/50 p-6 space-y-6">
            <AttachmentList attachments={currentTask.attachments} isEditing={isEditing} onAttachmentAdd={handleAttachmentAdd} onAttachmentDelete={handleAttachmentDelete}/>
          </div>
        </div>
      </ModalContent>
    </Modal>
  )
}