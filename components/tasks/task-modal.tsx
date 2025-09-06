"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { X, Calendar, Flag, Trash2 } from "lucide-react"
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

const availableLabels = [
  { id: "1", name: "Design", color: "#ec4899" },
  { id: "2", name: "Frontend", color: "#8b5cf6" },
  { id: "3", name: "Backend", color: "#14b8a6" },
  { id: "4", name: "React", color: "#00a3e0" },
  { id: "5", name: "Documentation", color: "#10b981" },
  { id: "6", name: "Bug", color: "#ef4444" },
  { id: "7", name: "Feature", color: "#f59e0b" },
]

const mockTeamMembers = [
  { id: "1", name: "Sarah Johnson", email: "sarah@example.com", avatar: "/sarah-avatar.png" },
  { id: "2", name: "Mike Chen", email: "mike@example.com", avatar: "/mike-avatar.jpg" },
  { id: "3", name: "Alex Rivera", email: "alex@example.com", avatar: "/diverse-user-avatars.png" },
  { id: "4", name: "Emma Davis", email: "emma@example.com", avatar: "/diverse-user-avatars.png" },
]

export function TaskModal({ isOpen, onClose, taskId, onSubmit, onDelete, mode = "edit" }: TaskModalProps) {
  const [task, setTask] = React.useState(mockTask)
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false)
  const [isEditing, setIsEditing] = React.useState(mode === "edit")

  const handleSave = () => {
    if (onSubmit) {
      onSubmit(task)
    }
    setIsEditing(false)
  }

  const handleDelete = () => {
    if (task.id && onDelete) {
      onDelete(task.id)
      setShowDeleteConfirm(false)
      onClose()
    }
  }

  const toggleLabel = (labelId: string) => {
    if (!isEditing) return

    const label = availableLabels.find((l) => l.id === labelId)
    if (!label) return

    setTask((prev) => ({
      ...prev,
      labels: prev.labels.some((l) => l.id === labelId)
        ? prev.labels.filter((l) => l.id !== labelId)
        : [...prev.labels, label],
    }))
  }

  const toggleAssignee = (assigneeId: string) => {
    if (!isEditing) return

    const assignee = mockTeamMembers.find((m) => m.id === assigneeId)
    if (!assignee) return

    setTask((prev) => ({
      ...prev,
      assignees: prev.assignees.some((a) => a.id === assigneeId)
        ? prev.assignees.filter((a) => a.id !== assigneeId)
        : [...prev.assignees, { id: assignee.id, name: assignee.name, avatar: assignee.avatar }],
    }))
  }

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <motion.div
          className="flex flex-col h-full"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ type: "", stiffness: 300, damping: 20 }}
        >
          {/* Header */}
          <ModalHeader className="flex-shrink-0 border-b border-border pb-4">
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-3">
                {isEditing ? (
                  <Input
                    value={task.title}
                    onChange={(e) => setTask({ ...task, title: e.target.value })}
                    className="text-lg font-semibold border-none p-0 h-auto bg-transparent focus-visible:ring-0"
                  />
                ) : (
                  <h1 className="text-lg font-semibold text-foreground">{task.title}</h1>
                )}

                <div className="flex items-center gap-4 flex-wrap">
                  {/* Status */}
                  <Select
                    value={task.status}
                    onValueChange={(value) => isEditing && setTask({ ...task, status: value })}
                    disabled={!isEditing}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todo">To Do</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="review">Review</SelectItem>
                      <SelectItem value="done">Done</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Priority */}
                  <Select
                    value={task.priority}
                    onValueChange={(value) => isEditing && setTask({ ...task, priority: value })}
                    disabled={!isEditing}
                  >
                    <SelectTrigger className="w-32">
                      <Flag className="w-4 h-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Due Date */}
                  {isEditing ? (
                    <DatePicker
                      value={task.dueDate}
                      onChange={(date) => setTask({ ...task, dueDate: date })}
                      placeholder="Select due date..."
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>Due {task.dueDate}</span>
                    </div>
                  )}
                </div>

                {/* Labels */}
                <div className="flex items-center gap-2 flex-wrap">
                  {task.labels.map((label) => (
                    <Badge
                      key={label.id}
                      variant="secondary"
                      className={cn("cursor-pointer", isEditing && "hover:opacity-80")}
                      style={{ backgroundColor: label.color + "20", color: label.color }}
                      onClick={() => toggleLabel(label.id)}
                    >
                      {label.name}
                      {isEditing && <X className="w-3 h-3 ml-1" />}
                    </Badge>
                  ))}
                  {isEditing && (
                    <div className="flex gap-1 flex-wrap">
                      {availableLabels
                        .filter((label) => !task.labels.some((l) => l.id === label.id))
                        .map((label) => (
                          <Button
                            key={label.id}
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs"
                            onClick={() => toggleLabel(label.id)}
                            style={{ color: label.color }}
                          >
                            + {label.name}
                          </Button>
                        ))}
                    </div>
                  )}
                </div>

                {/* Assignees */}
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1">
                    {task.assignees.map((assignee) => (
                      <Avatar
                        key={assignee.id}
                        className={cn(
                          "w-6 h-6 border-2 border-background",
                          isEditing && "cursor-pointer hover:scale-110 transition-transform",
                        )}
                        onClick={() => toggleAssignee(assignee.id)}
                      >
                        <AvatarImage src={assignee.avatar || "/placeholder.svg"} alt={assignee.name} />
                        <AvatarFallback className="text-xs">{assignee.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                  {isEditing && (
                    <div className="flex gap-1">
                      {mockTeamMembers
                        .filter((member) => !task.assignees.some((a) => a.id === member.id))
                        .slice(0, 3)
                        .map((member) => (
                          <Avatar
                            key={member.id}
                            className="w-6 h-6 border-2 border-dashed border-border cursor-pointer hover:scale-110 transition-transform opacity-50 hover:opacity-100"
                            onClick={() => toggleAssignee(member.id)}
                          >
                            <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                            <AvatarFallback className="text-xs">{member.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                        ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isEditing ? (
                  <>
                    <Button onClick={handleSave} size="sm">
                      Save
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)} size="sm">
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button variant="outline" onClick={() => setIsEditing(true)} size="sm">
                    Edit
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </ModalHeader>

          {showDeleteConfirm ? (
            <div className="p-6 space-y-4">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
                  <Trash2 className="w-6 h-6 text-destructive" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Delete Task</h3>
                <p className="text-muted-foreground">
                  Are you sure you want to delete "{task.title}"? This action cannot be undone.
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="destructive" onClick={handleDelete} className="flex-1">
                  Delete Task
                </Button>
                <Button variant="outline" onClick={() => setShowDeleteConfirm(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            /* Content */
            <div className="flex-1 overflow-y-auto">
              <div className="grid lg:grid-cols-3 gap-6 h-full">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6 overflow-y-auto p-6">
                  {/* Description */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-foreground">Description</h4>
                    {isEditing ? (
                      <Textarea
                        value={task.description}
                        onChange={(e) => setTask({ ...task, description: e.target.value })}
                        placeholder="Add a description..."
                        className="min-h-[100px]"
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">{task.description || "No description provided."}</p>
                    )}
                  </div>

                  {/* Subtasks */}
                  <SubtaskList subtasks={task.subtasks} />

                  {/* Activity Tabs */}
                  <Tabs defaultValue="comments" className="overflow-y-auto space-y-4">
                    <TabsList>
                      <TabsTrigger value="comments">Comments</TabsTrigger>
                      <TabsTrigger value="activity">Activity</TabsTrigger>
                    </TabsList>
                    <TabsContent value="comments">
                      <CommentSection />
                    </TabsContent>
                    <TabsContent value="activity">
                      <div className="text-center py-8 text-muted-foreground">Activity history will be shown here</div>
                    </TabsContent>
                  </Tabs>
                </div>

                {/* Sidebar */}
                <div className="border-l border-border p-6 overflow-y-auto">
                  <AttachmentList />
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </ModalContent>
    </Modal>
  )
}
