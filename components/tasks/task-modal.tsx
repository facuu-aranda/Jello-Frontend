"use client"
import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { X, Calendar, Flag, Trash2, Edit, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Modal, ModalContent, ModalHeader, ModalTitle } from "@/components/ui/modal"
import { SubtaskList } from "./subtask-list"
import { CommentSection } from "./comment-section"
import { AttachmentList } from "./attachment-list"
import { cn } from "@/lib/utils"
import { DatePicker } from "@/components/ui/date-picker"

interface TaskData {
  id: string; title: string; description?: string;
  priority: "low" | "medium" | "high" | "critical";
  status: "todo" | "in-progress" | "review" | "done";
  labels: any[]; assignees?: any[]; dueDate?: string;
  subtasks: any[]; projectId?: string;
}
interface LabelData { id: string; name: string; color: string; }
interface TaskModalProps {
  isOpen: boolean; onClose: () => void; task: TaskData | null;
  onSubmit?: (taskData: any) => void; onDelete?: (taskId: string) => void;
  showGoToProjectButton?: boolean; mode?: "view" | "edit";
}

const mockComments = [
  { id: "1", author: { id: "1", name: "Sarah", avatar: "/sarah-avatar.png" }, content: "I've started working on the wireframes. Should have the first draft ready by tomorrow.", timestamp: "2 hours ago" },
  { id: "2", author: { id: "2", name: "Mike", avatar: "/mike-avatar.jpg" }, content: "@Sarah looks great! Can you also include the mobile version?", timestamp: "1 hour ago" },
  { id: "3", author: { id: "3", name: "Alex", avatar: "/diverse-user-avatars.png" }, content: "I can help with the responsive design once the desktop version is finalized.", timestamp: "30 minutes ago" },
]

// 👇 --- COLORES RESTAURADOS A VALORES HEXADECIMALES PARA PERMITIR OPACIDAD --- 👇
const availableLabels: LabelData[] = [
  { id: "1", name: "Design", color: "#ec4899" },      // Pink
  { id: "2", name: "Frontend", color: "#8b5cf6" },    // Purple
  { id: "3", name: "Backend", color: "#14b8a6" },     // Teal
  { id: "4", name: "Bug", color: "#be123c" },         // Destructive
  { id: "5", name: "Feature", color: "#00a3e0" },     // Primary
  { id: "6", name: "Marketing", color: "#ff6f61" },   // Accent
];

export function TaskModal({ isOpen, onClose, task, onSubmit, onDelete, showGoToProjectButton = false, mode = "view" }: TaskModalProps) {
  const [currentTask, setCurrentTask] = React.useState(task);
  const [isEditing, setIsEditing] = React.useState(mode === "edit");

  React.useEffect(() => {
    if (isOpen) { setCurrentTask(task); setIsEditing(mode === "edit"); }
  }, [isOpen, task, mode]);

  const handleSave = () => { onSubmit?.(currentTask); setIsEditing(false); }
  const handleDelete = () => { if (currentTask?.id && onDelete) { onDelete(currentTask.id); onClose(); } }
  const handleLabelToggle = (label: LabelData) => {
    if (!currentTask) return;
    const newLabels = currentTask.labels.some(l => l.id === label.id)
      ? currentTask.labels.filter(l => l.id !== label.id)
      : [...currentTask.labels, label];
    setCurrentTask({ ...currentTask, labels: newLabels });
  }
  const handleSubtaskToggle = (subtaskId: string) => {
    if (!currentTask) return;
    const newSubtasks = currentTask.subtasks.map(st => st.id === subtaskId ? { ...st, completed: !st.completed } : st);
    setCurrentTask({ ...currentTask, subtasks: newSubtasks });
  }

  if (!isOpen || !currentTask) return null;

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent className="w-[95vw] max-w-4xl max-h-[90vh] grid grid-rows-[auto,1fr] p-0 overflow-hidden glass-card">
        <ModalHeader className="flex-shrink-0 border-b border-border/50 px-6 pt-6 pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-3 mr-4">
              <h1 className="text-lg font-semibold text-foreground">{currentTask.title}</h1>
              <div className="flex items-center gap-4 flex-wrap">
                <Select value={currentTask.status} onValueChange={(value: any) => isEditing && setCurrentTask(prev => prev ? { ...prev, status: value } : null)} disabled={!isEditing}>
                  <SelectTrigger className="w-auto min-w-[120px]"><SelectValue placeholder="Select status..." /></SelectTrigger>
                  <SelectContent><SelectItem value="todo">To Do</SelectItem><SelectItem value="in-progress">In Progress</SelectItem><SelectItem value="review">Review</SelectItem><SelectItem value="done">Done</SelectItem></SelectContent>
                </Select>
                <Select value={currentTask.priority} onValueChange={(value: any) => isEditing && setCurrentTask(prev => prev ? { ...prev, priority: value } : null)} disabled={!isEditing}>
                  <SelectTrigger className="w-auto min-w-[120px]"><Flag className="w-4 h-4 mr-2" /><SelectValue placeholder="Select priority..." /></SelectTrigger>
                  <SelectContent><SelectItem value="low">Low</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="high">High</SelectItem><SelectItem value="critical">Critical</SelectItem></SelectContent>
                </Select>
                {isEditing ? (
                  <DatePicker date={currentTask.dueDate ? new Date(currentTask.dueDate) : undefined} onDateChange={(date: any) => setCurrentTask(prev => prev ? { ...prev, dueDate: date?.toISOString() } : null)} />
                ) : (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground"><Calendar className="w-4 h-4" /><span>Due {currentTask.dueDate ? new Date(currentTask.dueDate).toLocaleDateString() : "N/A"}</span></div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap justify-end">
              {showGoToProjectButton && (<Button asChild variant="outline" size="sm"><Link href={`/project/${currentTask.projectId || 1}`}>Go to Project <ArrowRight className="w-4 h-4 ml-2" /></Link></Button>)}
              {!isEditing ? (<Button variant="outline" onClick={() => setIsEditing(true)} size="sm"><Edit className="w-4 h-4 mr-2" />Edit</Button>) : (<Button onClick={handleSave} size="sm">Save</Button>)}
              <Button variant="ghost" size="icon" onClick={handleDelete} className="text-destructive hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
              <Button variant="ghost" size="icon" onClick={onClose}><X className="w-4 h-4" /></Button>
            </div>
          </div>
        </ModalHeader>
        <div className="overflow-y-auto grid lg:grid-cols-3 min-h-0">
          <div className="lg:col-span-2 space-y-6 p-6">
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Description</h4>
              {isEditing ? (<Textarea value={currentTask.description} onChange={(e) => setCurrentTask(prev => prev ? { ...prev, description: e.target.value } : null)} className="min-h-[100px]" />) : (<p className="text-sm text-muted-foreground">{currentTask.description || "No description provided."}</p>)}
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Labels</h4>
              <div className="flex flex-wrap gap-2">
                {isEditing ? (
                  availableLabels.map(label => {
                    const isSelected = currentTask.labels.some(l => l.id === label.id);
                    return (
                      <Badge
                        key={label.id}
                        variant={"outline"} // Siempre usamos outline para la estructura base
                        className="cursor-pointer transition-all border-2 text-sm py-1 px-3"
                        style={{
                          // 👇 --- LÓGICA DE ESTILO CORREGIDA --- 👇
                          backgroundColor: isSelected ? `${label.color}40` : 'transparent',
                          color: label.color,
                          borderColor: label.color
                        }}
                        onClick={() => handleLabelToggle(label)}
                      >
                        {label.name}
                      </Badge>
                    )
                  })
                ) : (
                  currentTask.labels.map((label: any) => (
                    <Badge key={label.id} variant="secondary" className="text-sm py-1 px-3" style={{ backgroundColor: label.color + "20", color: label.color }}>
                      {label.name}
                    </Badge>
                  ))
                )}
              </div>
            </div>
            <SubtaskList subtasks={currentTask.subtasks} isEditing={isEditing} onSubtaskAdd={() => { }} onSubtaskDelete={() => { }} onSubtaskToggle={handleSubtaskToggle} />
            <CommentSection comments={mockComments} />
          </div>
          <div className="lg:col-span-1 lg:border-l border-border/50 p-6 space-y-6">
            <AttachmentList attachments={[]} isEditing={isEditing} />
          </div>
        </div>
      </ModalContent>
    </Modal>
  )
}