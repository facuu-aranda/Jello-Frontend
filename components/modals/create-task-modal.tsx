"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { X, Calendar, Flag, Tag, Users, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Modal, ModalContent, ModalHeader } from "@/components/ui/modal"
import { DatePicker } from "@/components/ui/date-picker"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"

interface CreateTaskModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (taskData: any) => void
  columnId?: string
  projectId?: string
}

const priorityOptions = [
  { value: "low", label: "Low", color: "text-green-500" },
  { value: "medium", label: "Medium", color: "text-yellow-500" },
  { value: "high", label: "High", color: "text-orange-500" },
  { value: "critical", label: "Critical", color: "text-red-500" },
]

const statusOptions = [
  { value: "todo", label: "To Do" },
  { value: "in-progress", label: "In Progress" },
  { value: "review", label: "Review" },
  { value: "done", label: "Done" },
]

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

export function CreateTaskModal({ isOpen, onClose, onSubmit, columnId, projectId }: CreateTaskModalProps) {
  const [formData, setFormData] = React.useState({
    title: "",
    description: "",
    priority: "medium",
    status: columnId || "todo",
    dueDate: undefined as Date | undefined,
    labels: [] as string[],
    assignees: [] as string[],
    subtasks: [] as string[],
  })
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [newSubtask, setNewSubtask] = React.useState("")
  const isMobile = useIsMobile()

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.title.trim()) {
      newErrors.title = "Task title is required"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit({
        ...formData,
        dueDate: formData.dueDate?.toISOString(),
        projectId,
        labels: formData.labels.map((id) => availableLabels.find((l) => l.id === id)).filter(Boolean),
        assignees: formData.assignees.map((id) => mockTeamMembers.find((m) => m.id === id)).filter(Boolean),
      })
      setFormData({
        title: "", description: "", priority: "medium", status: columnId || "todo",
        dueDate: undefined, labels: [], assignees: [], subtasks: [],
      })
      setErrors({})
      onClose()
    }
  }

  const toggleLabel = (labelId: string) => {
    setFormData((prev) => ({
      ...prev,
      labels: prev.labels.includes(labelId) ? prev.labels.filter((id) => id !== labelId) : [...prev.labels, labelId],
    }))
  }

  const toggleAssignee = (assigneeId: string) => {
    setFormData((prev) => ({
      ...prev,
      assignees: prev.assignees.includes(assigneeId)
        ? prev.assignees.filter((id) => id !== assigneeId)
        : [...prev.assignees, assigneeId],
    }))
  }

  const addSubtask = () => {
    if (newSubtask.trim()) {
      setFormData((prev) => ({ ...prev, subtasks: [...prev.subtasks, newSubtask.trim()] }))
      setNewSubtask("")
    }
  }

  const removeSubtask = (index: number) => {
    setFormData((prev) => ({ ...prev, subtasks: prev.subtasks.filter((_, i) => i !== index) }))
  }

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent className={cn("max-h-[95vh] overflow-hidden", isMobile ? "max-w-[95vw] mx-2" : "max-w-3xl")}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <ModalHeader className="border-b border-border pb-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground">Create New Task</h2>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </ModalHeader>

          <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(95vh-120px)]">
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Task Title *</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter task title..."
                  className={errors.title ? "border-destructive" : ""}
                />
                {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the task..."
                  className="min-h-[80px] sm:min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2"><Flag className="w-4 h-4" />Priority</label>
                  <Select value={formData.priority} onValueChange={(value) => setFormData((prev) => ({ ...prev, priority: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priorityOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <div className={cn("w-2 h-2 rounded-full", option.color.replace("text-", "bg-"))} />
                            {option.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Status</label>
                  <Select value={formData.status} onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (<SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2"><Calendar className="w-4 h-4" />Due Date (Optional)</label>
                <DatePicker
                  date={formData.dueDate}
                  onDateChange={(date: Date | undefined) => setFormData((prev) => ({ ...prev, dueDate: date }))}
                  placeholder="Select due date..."
                />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground flex items-center gap-2"><Tag className="w-4 h-4" />Labels</label>
                <div className="flex flex-wrap gap-2">
                  {availableLabels.map((label) => (
                    <motion.button key={label.id} type="button" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => toggleLabel(label.id)}
                      className={cn( "px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium border-2 transition-all min-h-[32px] touch-manipulation",
                        formData.labels.includes(label.id) ? "border-transparent text-white" : "border-border text-foreground hover:bg-muted",
                      )}
                      style={formData.labels.includes(label.id) ? { backgroundColor: label.color } : {}}>
                      {label.name}
                    </motion.button>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground flex items-center gap-2"><Users className="w-6 h-6 sm:w-8 sm:h-8" />Assignees</label>
                <div className="space-y-2 max-h-40 sm:max-h-48 overflow-y-auto">
                  {mockTeamMembers.map((member) => (
                    <motion.div key={member.id} className={cn("flex items-center gap-3 p-2 sm:p-3 rounded-xl border-2 cursor-pointer transition-all min-h-[48px] touch-manipulation", formData.assignees.includes(member.id) ? "border-primary bg-primary/10" : "border-border hover:bg-muted")}
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => toggleAssignee(member.id)}>
                      <Avatar className="w-6 h-6 sm:w-8 sm:h-8"><AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} /><AvatarFallback className="text-xs">{member.name.charAt(0)}</AvatarFallback></Avatar>
                      <div className="flex-1 min-w-0"><p className="font-medium text-foreground text-sm sm:text-base truncate">{member.name}</p><p className="text-xs sm:text-sm text-muted-foreground truncate">{member.email}</p></div>
                      {formData.assignees.includes(member.id) && (<Badge variant="secondary" className="text-xs">Assigned</Badge>)}
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">Subtasks</label>
                <div className="space-y-2">
                  {formData.subtasks.map((subtask, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded-lg min-h-[40px]">
                      <span className="flex-1 text-sm">{subtask}</span>
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeSubtask(index)} className="min-h-[32px] min-w-[32px]"><X className="w-4 h-4" /></Button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Input value={newSubtask} onChange={(e) => setNewSubtask(e.target.value)} placeholder="Add a subtask..." onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSubtask())} className="min-h-[40px]" />
                    <Button type="button" onClick={addSubtask} disabled={!newSubtask.trim()} className="min-h-[40px] min-w-[40px]"><Plus className="w-4 h-4" /></Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 p-4 sm:p-6 pt-4 border-t border-border">
              <Button type="submit" className="w-full sm:flex-1 min-h-[44px]">Create Task</Button>
              <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto min-h-[44px] bg-transparent">Cancel</Button>
            </div>
          </form>
        </motion.div>
      </ModalContent>
    </Modal>
  )
}

