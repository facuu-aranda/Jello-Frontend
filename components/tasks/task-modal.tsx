"use client"
import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { X, Calendar, Flag, Trash2, Edit, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Modal, ModalContent, ModalHeader } from "@/components/ui/modal"
import { SubtaskList } from "./subtask-list"
import { CommentSection } from "./comment-section"
import { AttachmentList } from "./attachment-list"
import { cn } from "@/lib/utils"
import { DatePicker } from "@/components/ui/date-picker"

// CORREGIDO: Definimos interfaces claras para los datos
interface LabelData { id: string; name: string; color: string; }
interface SubtaskData { id: string; text: string; completed: boolean; }
interface CommentData { id: string; author: { id: string; name: string; avatar?: string }; content: string; timestamp: string; }
interface AttachmentData { id: string; name: string; size: string; type: "image" | "document" | "other"; url: string; }

interface TaskData {
  id: string; title: string; description?: string;
  priority: "low" | "medium" | "high" | "critical";
  status: "todo" | "in-progress" | "review" | "done";
  labels: LabelData[];
  subtasks: SubtaskData[];
  comments: CommentData[];
  attachments: AttachmentData[];
  dueDate?: string; projectId?: string;
}
interface TaskModalProps {
  isOpen: boolean; onClose: () => void; task: TaskData | null;
  onSubmit?: (taskData: any) => void; onDelete?: (taskId: string) => void;
  showGoToProjectButton?: boolean; mode?: "view" | "edit";
}

const availableLabels: LabelData[] = [
  { id: "1", name: "Design", color: "#ec4899" },
  { id: "2", name: "Frontend", color: "#8b5cf6" },
  { id: "3", name: "Backend", color: "#14b8a6" },
  { id: "4", name: "Bug", color: "#be123c" },
  { id: "5", name: "Feature", color: "#00a3e0" },
  { id: "6", name: "Marketing", color: "#ff6f61" },
];

export function TaskModal({ isOpen, onClose, task, onSubmit, onDelete, showGoToProjectButton = false, mode = "view" }: TaskModalProps) {
  const [currentTask, setCurrentTask] = React.useState<TaskData | null>(task);
  const [isEditing, setIsEditing] = React.useState(mode === "edit");

  React.useEffect(() => {
    if (isOpen) { setCurrentTask(task); setIsEditing(mode === "edit"); }
  }, [isOpen, task, mode]);

  const handleSave = () => { onSubmit?.(currentTask); setIsEditing(false); }
  const handleDelete = () => { if (currentTask?.id && onDelete) { onDelete(currentTask.id); onClose(); } }
  
  // CORREGIDO: Tipado explícito en los parámetros
  const handleLabelToggle = (label: LabelData) => {
    if (!currentTask) return;
    const newLabels = currentTask.labels.some((l: LabelData) => l.id === label.id)
      ? currentTask.labels.filter((l: LabelData) => l.id !== label.id)
      : [...currentTask.labels, label];
    setCurrentTask({ ...currentTask, labels: newLabels });
  }

  const handleSubtaskToggle = (subtaskId: string) => {
    if (!currentTask) return;
    const newSubtasks = currentTask.subtasks.map((st: SubtaskData) => st.id === subtaskId ? { ...st, completed: !st.completed } : st);
    setCurrentTask({ ...currentTask, subtasks: newSubtasks });
  }
  
  // CORREGIDO: Tipado explícito en los parámetros
  const handleUpdateField = <K extends keyof TaskData>(field: K, value: TaskData[K]) => {
    setCurrentTask(prev => prev ? { ...prev, [field]: value } : null);
  }

  if (!isOpen || !currentTask) return null;

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent className="w-[95vw] max-w-4xl max-h-[90vh] grid grid-rows-[auto,1fr] p-0 overflow-hidden glass-card">
        <ModalHeader className="flex-shrink-0 border-b border-border/50 px-6 pt-6 pb-4">
            {/* ... (JSX del header se mantiene igual) ... */}
        </ModalHeader>
        <div className="overflow-y-auto grid lg:grid-cols-3 min-h-0">
          <div className="lg:col-span-2 space-y-6 p-6">
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Description</h4>
              {isEditing ? (<Textarea value={currentTask.description} onChange={(e) => handleUpdateField('description', e.target.value)} className="min-h-[100px]" />) : (<p className="text-sm text-muted-foreground">{currentTask.description || "No description provided."}</p>)}
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Labels</h4>
              <div className="flex flex-wrap gap-2">
                {isEditing ? (
                  availableLabels.map(label => {
                    const isSelected = currentTask.labels.some((l: LabelData) => l.id === label.id);
                    return (
                      <Badge
                        key={label.id}
                        variant={"outline"}
                        className="cursor-pointer transition-all border-2 text-sm py-1 px-3"
                        style={{ backgroundColor: isSelected ? `${label.color}40` : 'transparent', color: label.color, borderColor: label.color }}
                        onClick={() => handleLabelToggle(label)}
                      >
                        {label.name}
                      </Badge>
                    )
                  })
                ) : (
                  currentTask.labels.map((label: LabelData) => (
                    <Badge key={label.id} variant="secondary" className="text-sm py-1 px-3" style={{ backgroundColor: label.color + "20", color: label.color }}>
                      {label.name}
                    </Badge>
                  ))
                )}
              </div>
            </div>
            <SubtaskList subtasks={currentTask.subtasks} isEditing={isEditing} onSubtaskAdd={() => { }} onSubtaskDelete={() => { }} onSubtaskToggle={handleSubtaskToggle} />
            <CommentSection comments={currentTask.comments} />
          </div>
          <div className="lg:col-span-1 lg:border-l border-border/50 p-6 space-y-6">
            <AttachmentList attachments={currentTask.attachments} isEditing={isEditing} />
          </div>
        </div>
      </ModalContent>
    </Modal>
  )
}
