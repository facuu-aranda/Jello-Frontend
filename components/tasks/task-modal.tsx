"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { X, Calendar, Flag, Trash2, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Modal, ModalContent, ModalHeader } from "@/components/ui/modal"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DatePicker } from "@/components/ui/date-picker"
import { SubtaskList } from "./subtask-list"
import { CommentSection } from "./comment-section"
import { AttachmentList } from "./attachment-list"
import { cn } from "@/lib/utils"

interface TaskModalProps {
  isOpen: boolean
  onClose: () => void
  taskId?: string
  onSubmit?: (taskData: any) => void
  onDelete?: (taskId: string) => void
  mode?: "view" | "edit"
}

const mockTask = {
  id: "1",
  title: "Design new homepage layout",
  description:
    "Create wireframes and mockups for the new homepage design with improved user experience and modern aesthetics.",
  priority: "high",
  status: "todo",
  labels: [
    { id: "1", name: "Design", color: "#ec4899" },
    { id: "2", name: "Frontend", color: "#8b5cf6" },
  ],
  assignees: [
    { id: "1", name: "Sarah", avatar: "/sarah-avatar.png" },
    { id: "2", name: "Mike", avatar: "/mike-avatar.jpg" },
  ],
  dueDate: "2024-12-15",
  subtasks: [
    { id: "1", text: "Research competitor websites", completed: true },
    { id: "2", text: "Create user personas", completed: true },
    { id: "3", text: "Design wireframes", completed: false },
    { id: "4", text: "Create high-fidelity mockups", completed: false },
    { id: "5", text: "Get stakeholder approval", completed: false },
  ],
}

export function TaskModal({ isOpen, onClose, taskId, onSubmit, onDelete, mode = "view" }: TaskModalProps) {
  const [task, setTask] = React.useState(mockTask)
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false)
  const [isEditing, setIsEditing] = React.useState(mode === "edit")

  React.useEffect(() => {
    setIsEditing(mode === "edit");
  }, [mode]);

  const handleSave = () => {
    onSubmit?.(task);
    setIsEditing(false);
  }

  const handleDelete = () => {
    if (task.id && onDelete) {
      onDelete(task.id);
      setShowDeleteConfirm(false);
      onClose();
    }
  }

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      {/* 👇 --- CAMBIO CLAVE: El propio ModalContent ahora tiene el scroll --- 👇 */}
      <ModalContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto p-0 glass-card">
        <ModalHeader className="sticky top-0 z-10 bg-inherit/80 backdrop-blur-sm flex-shrink-0 border-b border-border/50 px-6 pt-6 pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-3 mr-4">
              {isEditing ? (
                <Input value={task.title} onChange={(e) => setTask({ ...task, title: e.target.value })} className="text-lg font-semibold border-none p-0 h-auto bg-transparent focus-visible:ring-0" />
              ) : (
                <h1 className="text-lg font-semibold text-foreground">{task.title}</h1>
              )}
              <div className="flex items-center gap-4 flex-wrap">
                <Select value={task.status} onValueChange={(value) => isEditing && setTask({ ...task, status: value })} disabled={!isEditing}>
                  <SelectTrigger className="w-auto min-w-[120px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={task.priority} onValueChange={(value) => isEditing && setTask({ ...task, priority: value })} disabled={!isEditing}>
                  <SelectTrigger className="w-auto min-w-[120px]"><Flag className="w-4 h-4 mr-2" /><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
                {isEditing ? (
                  <DatePicker value={task.dueDate} onChange={(date: any) => setTask({ ...task, dueDate: date })} />
                ) : (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Due {task.dueDate}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <Button onClick={handleSave} size="sm">Save</Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)} size="sm">Cancel</Button>
                </>
              ) : (
                <Button variant="outline" onClick={() => setIsEditing(true)} size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              )}
              <Button variant="ghost" size="icon" onClick={() => setShowDeleteConfirm(true)} className="text-destructive hover:text-destructive">
                <Trash2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </ModalHeader>

        <div className="p-6">
          {showDeleteConfirm ? (
            <div className="text-center">
              <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-destructive" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Delete Task</h3>
              <p className="text-muted-foreground">
                Are you sure you want to delete "{task.title}"? This action cannot be undone.
              </p>
              <div className="flex gap-3 mt-4">
                <Button variant="destructive" onClick={handleDelete} className="flex-1">Delete Task</Button>
                <Button variant="outline" onClick={() => setShowDeleteConfirm(false)} className="flex-1">Cancel</Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row lg:gap-6">
              <div className="lg:w-2/3 space-y-6">
                <div className="space-y-3">
                  <h4 className="font-medium text-foreground">Description</h4>
                  {isEditing ? (
                    <Textarea value={task.description} onChange={(e) => setTask({ ...task, description: e.target.value })} className="min-h-[100px]" />
                  ) : (
                    <p className="text-sm text-muted-foreground">{task.description || "No description provided."}</p>
                  )}
                </div>
                <SubtaskList subtasks={task.subtasks} />
                <Tabs defaultValue="comments" className="pt-4">
                  <TabsList>
                    <TabsTrigger value="comments">Comments</TabsTrigger>
                    <TabsTrigger value="activity">Activity</TabsTrigger>
                  </TabsList>
                  <TabsContent value="comments" className="mt-4"><CommentSection /></TabsContent>
                  <TabsContent value="activity">
                    <div className="text-center py-8 text-muted-foreground">Activity history will be shown here</div>
                  </TabsContent>
                </Tabs>
              </div>
              <div className="lg:w-1/3 lg:border-l lg:pl-6 border-border/50 space-y-6 mt-6 lg:mt-0">
                <AttachmentList />
              </div>
            </div>
          )}
        </div>
      </ModalContent>
    </Modal>
  )
}