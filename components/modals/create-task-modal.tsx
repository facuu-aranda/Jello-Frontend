"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { X, Calendar, Flag, Tag, Users, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Modal, ModalContent, ModalHeader } from "@/components/ui/modal"
import { DatePicker } from "@/components/ui/date-picker"
import { cn } from "@/lib/utils"
import { Label, UserSummary, ProjectDetails, Attachment } from "@/types"
import { AssigneeSelector } from "@/components/forms/assignee-selector"
import { useApi } from "@/hooks/useApi"
import { Skeleton } from "@/components/ui/skeleton"
import { AttachmentList } from "../tasks/attachment-list"

type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done';
type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

export interface CreateTaskFormDataState {
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: Date | undefined;
  labels: Label[]; 
  assignees: string[];
  subtasks: string[];
  attachments: File[];
}

interface CreateTaskModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (taskData: FormData) => void 
  defaultStatus?: TaskStatus
  projectId?: string
}

const priorityOptions: { value: TaskPriority, label: string, color: string }[] = [
  { value: "low", label: "Low", color: "text-green-500" },
  { value: "medium", label: "Medium", color: "text-yellow-500" },
  { value: "high", label: "High", color: "text-orange-500" },
  { value: "critical", label: "Critical", color: "text-red-500" },
];

const statusOptions: { value: TaskStatus, label: string }[] = [
  { value: "todo", label: "To Do" },
  { value: "in-progress", label: "In Progress" },
  { value: "review", label: "Review" },
  { value: "done", label: "Done" },
];

export function CreateTaskModal({ isOpen, onClose, onSubmit, defaultStatus = 'todo', projectId }: CreateTaskModalProps) {
  const [formData, setFormData] = React.useState<CreateTaskFormDataState>({
    title: "",
    description: "",
    priority: "medium",
    status: defaultStatus,
    dueDate: undefined,
    labels: [],
    assignees: [],
    subtasks: [],
    attachments: [],
  });
  
  const { data: project, isLoading: isLoadingProject } = projectId ? useApi<ProjectDetails>(`/projects/${projectId}`) : { data: undefined, isLoading: false };
  const { data: availableLabels, isLoading: isLoadingLabels } = projectId ? useApi<Label[]>(`/projects/${projectId}/labels`) : { data: [], isLoading: false };

  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [newSubtask, setNewSubtask] = React.useState("")

  React.useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({ ...prev, status: defaultStatus }));
    } else {
      setFormData({
        title: "", description: "", priority: "medium", status: defaultStatus,
        dueDate: undefined, labels: [], assignees: [], subtasks: [], attachments: [],
      });
      setErrors({});
    }
  }, [defaultStatus, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.title.trim()) {
      newErrors.title = "Task title is required"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const apiFormData = new FormData();
      
      apiFormData.append('title', formData.title);
      apiFormData.append('description', formData.description);
      apiFormData.append('priority', formData.priority);
      apiFormData.append('status', formData.status);
      if (formData.dueDate) {
        apiFormData.append('dueDate', formData.dueDate.toISOString());
      }
      
      apiFormData.append('labels', JSON.stringify(formData.labels.map(l => l._id)));
      apiFormData.append('assignees', JSON.stringify(formData.assignees));
      apiFormData.append('subtasks', JSON.stringify(formData.subtasks));

      formData.attachments.forEach(file => {
        apiFormData.append('attachments', file);
      });

      onSubmit(apiFormData); 
    }
  }

  const toggleLabel = (label: Label) => {
    setFormData((prev) => {
      const isSelected = prev.labels.some(l => l._id === label._id);
      return {
        ...prev,
        labels: isSelected
          ? prev.labels.filter((l) => l._id !== label._id)
          : [...prev.labels, label],
      };
    });
  };

  const addSubtask = () => {
    if (newSubtask.trim()) {
      setFormData((prev) => ({ ...prev, subtasks: [...prev.subtasks, newSubtask.trim()] }))
      setNewSubtask("")
    }
  }

  const removeSubtask = (index: number) => {
    setFormData((prev) => ({ ...prev, subtasks: prev.subtasks.filter((_, i) => i !== index) }))
  }

  const handleAttachmentAdd = (files: FileList) => {
    setFormData(prev => ({ ...prev, attachments: [...prev.attachments, ...Array.from(files)] }));
  };

  const handleAttachmentDelete = (fileName: string) => {
    setFormData(prev => ({ ...prev, attachments: prev.attachments.filter(f => f.name !== fileName) }));
  };
  
  const attachmentLikeFiles: Attachment[] = formData.attachments.map((file, index) => ({
    _id: `${file.name}-${index}`,
    name: file.name,
    url: '',
    size: `${(file.size / 1024).toFixed(1)} KB`,
    type: file.type.startsWith('image/') ? 'image' : 'document',
  }));

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent className="max-h-[95vh] overflow-hidden max-w-3xl">
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
                  <Select value={formData.priority} onValueChange={(value: TaskPriority) => setFormData((prev) => ({ ...prev, priority: value }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
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
                  <Select value={formData.status} onValueChange={(value: TaskStatus) => setFormData((prev) => ({ ...prev, status: value }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (<SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2"><Calendar className="w-4 h-4" /> Due Date</label>
                <DatePicker date={formData.dueDate} setDate={(date) => setFormData(prev => ({ ...prev, dueDate: date }))} />
              </div>

              {(!isLoadingLabels && availableLabels && availableLabels.length > 0) && (
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2"><Tag className="w-4 h-4" />Labels</label>
                  <div className="flex flex-wrap gap-2">
                    {availableLabels.map((label) => {
                      const isSelected = formData.labels.some(l => l._id === label._id);
                      return (
                        <motion.button 
                          key={label._id} type="button" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} 
                          onClick={() => toggleLabel(label)}
                          className={cn("px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium border-2 transition-all min-h-[32px] touch-manipulation",
                            isSelected ? "border-transparent text-white" : "border-border text-foreground hover:bg-muted"
                          )}
                          style={isSelected ? { backgroundColor: label.color } : {}}>
                          {label.name}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground flex items-center gap-2"><Users className="w-4 h-4" />Assignees</label>
                <div className="space-y-2 max-h-40 sm:max-h-48 overflow-y-auto">
                  {isLoadingProject || !project ? (
                    <div className="space-y-2"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /></div>
                  ) : (
                    <AssigneeSelector
                      projectMembers={project.members}
                      selectedAssignees={formData.assignees}
                      onSelectionChange={(ids) => setFormData(prev => ({ ...prev, assignees: ids }))}
                    />
                  )}
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

              <div className="space-y-3">
                <AttachmentList
                  taskId=""
                  attachments={attachmentLikeFiles}
                  isEditing={true}
                  onAttachmentAdd={handleAttachmentAdd}
                  onAttachmentDelete={(id) => {
                    const fileToDelete = attachmentLikeFiles.find(f => f._id === id);
                    if (fileToDelete) handleAttachmentDelete(fileToDelete.name);
                  }}
                />
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