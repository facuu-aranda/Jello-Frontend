"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { X, Calendar, Flag, Tag, Users, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Modal, ModalContent, ModalHeader } from "@/components/ui/modal"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import { api } from "@/lib/api/client"
import { useAuth } from "@/contexts/AuthContext"
import { Task } from "@/lib/api/types"

interface CreateTaskModalProps {
  isOpen: boolean
  onClose: () => void
  onTaskCreated: (newTask: Task) => void
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

export function CreateTaskModal({ isOpen, onClose, onTaskCreated, columnId, projectId }: CreateTaskModalProps) {
  const { token } = useAuth();
  const isMobile = useIsMobile()

  const [formData, setFormData] = React.useState({
    title: "",
    description: "",
    priority: "medium",
    status: columnId || "todo",
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  
  // Sincroniza el estado inicial si el columnId cambia mientras el modal está abierto
  React.useEffect(() => {
    if (isOpen) {
        setFormData(prev => ({ ...prev, status: columnId || "todo" }));
    }
  }, [columnId, isOpen]);

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      priority: "medium",
      status: columnId || "todo",
    });
    setError(null);
    setIsLoading(false);
  }

  const handleClose = () => {
    resetForm();
    onClose();
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError("Task title is required");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (!projectId) throw new Error("Project ID is missing");
      
      const newTaskPayload = {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
      };

      const newTask = await api.post(
        `/projects/${projectId}/tasks`,
        newTaskPayload,
        token
      );
      
      onTaskCreated(newTask);
      handleClose();
    } catch (err: any) {
      setError(err.message || "Failed to create task.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal open={isOpen} onOpenChange={handleClose}>
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
              <Button variant="ghost" size="icon" onClick={handleClose}>
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
                  className={error ? "border-destructive" : ""}
                  disabled={isLoading}
                />
                {error && <p className="text-sm text-destructive">{error}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the task..."
                  className="min-h-[80px] sm:min-h-[100px]"
                  disabled={isLoading}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Flag className="w-4 h-4" />
                    Priority
                  </label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, priority: value }))}
                    disabled={isLoading}
                  >
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
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 p-4 sm:p-6 pt-4 border-t border-border">
              <Button type="submit" className="w-full sm:flex-1 min-h-[44px]" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Task"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="w-full sm:w-auto min-h-[44px] bg-transparent"
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </motion.div>
      </ModalContent>
    </Modal>
  )
}