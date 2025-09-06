"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { X, Users, Calendar, Palette, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Modal, ModalContent, ModalHeader } from "@/components/ui/modal"
import { DatePicker } from "@/components/ui/date-picker"
import { cn } from "@/lib/utils"

interface EditProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (projectData: any) => void
  onDelete?: (projectId: string) => void
  project?: {
    id: string
    name: string
    description: string
    color: string
    dueDate?: string
    members: Array<{
      id: string
      name: string
      avatar?: string
    }>
    isOwner: boolean
  }
}

const projectColors = [
  { id: "bg-primary", name: "Jello Blue", color: "#00a3e0" },
  { id: "bg-accent-pink", name: "Pink", color: "#ec4899" },
  { id: "bg-accent-purple", name: "Purple", color: "#8b5cf6" },
  { id: "bg-accent-teal", name: "Teal", color: "#14b8a6" },
  { id: "bg-accent", name: "Coral", color: "#ff6f61" },
]

const mockTeamMembers = [
  { id: "1", name: "Sarah Johnson", email: "sarah@example.com", avatar: "/sarah-avatar.png" },
  { id: "2", name: "Mike Chen", email: "mike@example.com", avatar: "/mike-avatar.jpg" },
  { id: "3", name: "Alex Rivera", email: "alex@example.com", avatar: "/diverse-user-avatars.png" },
  { id: "4", name: "Emma Davis", email: "emma@example.com", avatar: "/diverse-user-avatars.png" },
]

export function EditProjectModal({ isOpen, onClose, onSubmit, onDelete, project }: EditProjectModalProps) {
  const [formData, setFormData] = React.useState({
    name: "",
    description: "",
    color: "bg-primary",
    dueDate: "",
    members: [] as string[],
  })
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false)

  React.useEffect(() => {
    if (project) {
      setFormData({
        name: project.name,
        description: project.description,
        color: project.color,
        dueDate: project.dueDate || "",
        members: project.members.map((m) => m.id),
      })
    }
  }, [project])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Project name is required"
    }
    if (!formData.description.trim()) {
      newErrors.description = "Project description is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit({ ...formData, id: project?.id })
      setErrors({})
      onClose()
    }
  }

  const handleDelete = () => {
    if (project && onDelete) {
      onDelete(project.id)
      setShowDeleteConfirm(false)
      onClose()
    }
  }

  const toggleMember = (memberId: string) => {
    setFormData((prev) => ({
      ...prev,
      members: prev.members.includes(memberId)
        ? prev.members.filter((id) => id !== memberId)
        : [...prev.members, memberId],
    }))
  }

  if (!project) return null

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent className="max-w-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <ModalHeader className="border-b border-border pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold text-foreground">Edit Project</h2>
                {project.isOwner && (
                  <Badge variant="secondary" className="text-xs">
                    Owner
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                {project.isOwner && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
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
                <h3 className="text-lg font-semibold text-foreground">Delete Project</h3>
                <p className="text-muted-foreground">
                  Are you sure you want to delete "{project.name}"? This action cannot be undone and will remove all
                  tasks and data associated with this project.
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="destructive" onClick={handleDelete} className="flex-1">
                  Delete Project
                </Button>
                <Button variant="outline" onClick={() => setShowDeleteConfirm(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Project Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Project Name *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter project name..."
                  className={errors.name ? "border-destructive" : ""}
                  disabled={!project.isOwner}
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
              </div>

              {/* Project Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Description *</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your project..."
                  className={cn("min-h-[100px]", errors.description ? "border-destructive" : "")}
                  disabled={!project.isOwner}
                />
                {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
              </div>

              {/* Project Color */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Project Color
                </label>
                <div className="flex gap-3">
                  {projectColors.map((color) => (
                    <motion.button
                      key={color.id}
                      type="button"
                      whileHover={project.isOwner ? { scale: 1.1 } : {}}
                      whileTap={project.isOwner ? { scale: 0.95 } : {}}
                      onClick={() => project.isOwner && setFormData((prev) => ({ ...prev, color: color.id }))}
                      disabled={!project.isOwner}
                      className={cn(
                        "relative p-1 rounded-xl border-2 transition-all",
                        formData.color === color.id ? "border-primary" : "border-border",
                        !project.isOwner && "opacity-50 cursor-not-allowed",
                      )}
                    >
                      <div className="w-10 h-10 rounded-lg" style={{ backgroundColor: color.color }} />
                      {formData.color === color.id && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-3 h-3 bg-background rounded-full border border-foreground" />
                        </div>
                      )}
                    </motion.button>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Selected: {projectColors.find((c) => c.id === formData.color)?.name}
                </p>
              </div>

              {/* Due Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Due Date (Optional)
                </label>
                <DatePicker
                  value={formData.dueDate}
                  onChange={(date) => setFormData((prev) => ({ ...prev, dueDate: date }))}
                  placeholder="Select due date..."
                  disabled={!project.isOwner}
                />
              </div>

              {/* Team Members */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Team Members
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {mockTeamMembers.map((member) => (
                    <motion.div
                      key={member.id}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-xl border-2 transition-all",
                        formData.members.includes(member.id)
                          ? "border-primary bg-primary/10"
                          : "border-border hover:bg-muted",
                        project.isOwner ? "cursor-pointer" : "cursor-not-allowed opacity-50",
                      )}
                      whileHover={project.isOwner ? { scale: 1.02 } : {}}
                      whileTap={project.isOwner ? { scale: 0.98 } : {}}
                      onClick={() => project.isOwner && toggleMember(member.id)}
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                      </div>
                      {formData.members.includes(member.id) && <Badge variant="secondary">Selected</Badge>}
                    </motion.div>
                  ))}
                </div>
                {formData.members.length > 0 && (
                  <p className="text-sm text-muted-foreground">
                    {formData.members.length} member{formData.members.length !== 1 ? "s" : ""} selected
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-border">
                {project.isOwner ? (
                  <Button type="submit" className="flex-1">
                    Save Changes
                  </Button>
                ) : (
                  <Button type="button" disabled className="flex-1">
                    View Only (Not Owner)
                  </Button>
                )}
                <Button type="button" variant="outline" onClick={onClose}>
                  {project.isOwner ? "Cancel" : "Close"}
                </Button>
              </div>
            </form>
          )}
        </motion.div>
      </ModalContent>
    </Modal>
  )
}
