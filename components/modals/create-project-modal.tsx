"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { X, Users, Calendar, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Modal, ModalContent, ModalHeader } from "@/components/ui/modal"
import { DatePicker } from "@/components/ui/date-picker"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"

interface CreateProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (projectData: any) => void
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

export function CreateProjectModal({ isOpen, onClose, onSubmit }: CreateProjectModalProps) {
  const isMobile = useIsMobile()
  const [formData, setFormData] = React.useState({
    name: "",
    description: "",
    color: "bg-primary",
    dueDate: "",
    members: [] as string[],
  })
  const [errors, setErrors] = React.useState<Record<string, string>>({})

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
      onSubmit(formData)
      // Reset form
      setFormData({
        name: "",
        description: "",
        color: "bg-primary",
        dueDate: "",
        members: [],
      })
      setErrors({})
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

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent className={cn("max-h-[95vh] overflow-hidden", isMobile ? "max-w-[95vw] mx-2" : "max-w-2xl")}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <ModalHeader className="border-b border-border pb-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground">Create New Project</h2>
            </div>
          </ModalHeader>

          <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(95vh-120px)]">
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Project Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Project Name *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter project name..."
                  className={errors.name ? "border-destructive" : ""}
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
                  className={cn("min-h-[80px] sm:min-h-[100px]", errors.description ? "border-destructive" : "")}
                />
                {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
              </div>

              {/* Project Color */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Project Color
                </label>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {projectColors.map((color) => (
                    <motion.button
                      key={color.id}
                      type="button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setFormData((prev) => ({ ...prev, color: color.id }))}
                      className={cn(
                        "relative p-1 rounded-xl border-2 transition-all",
                        formData.color === color.id ? "border-primary" : "border-border",
                      )}
                    >
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg" style={{ backgroundColor: color.color }} />
                      {formData.color === color.id && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-background rounded-full border border-foreground" />
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
                />
              </div>

              {/* Team Members */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Team Members
                </label>
                <div className="space-y-2 max-h-40 sm:max-h-48 overflow-y-auto">
                  {mockTeamMembers.map((member) => (
                    <motion.div
                      key={member.id}
                      className={cn(
                        "flex items-center gap-3 p-2 sm:p-3 rounded-xl border-2 cursor-pointer transition-all",
                        formData.members.includes(member.id)
                          ? "border-primary bg-primary/10"
                          : "border-border hover:bg-muted",
                      )}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleMember(member.id)}
                    >
                      <Avatar className="w-6 h-6 sm:w-8 sm:h-8">
                        <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                        <AvatarFallback className="text-xs">{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground text-sm sm:text-base truncate">{member.name}</p>
                        <p className="text-xs sm:text-sm text-muted-foreground truncate">{member.email}</p>
                      </div>
                      {formData.members.includes(member.id) && (
                        <Badge variant="secondary" className="text-xs">
                          Selected
                        </Badge>
                      )}
                    </motion.div>
                  ))}
                </div>
                {formData.members.length > 0 && (
                  <p className="text-sm text-muted-foreground">
                    {formData.members.length} member{formData.members.length !== 1 ? "s" : ""} selected
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 p-4 sm:p-6 pt-4 border-t border-border">
              <Button type="submit" className="w-full sm:flex-1">
                Create Project
              </Button>
              <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto bg-transparent">
                Cancel
              </Button>
            </div>
          </form>
        </motion.div>
      </ModalContent>
    </Modal>
  )
}
