"use client"
import { motion } from "framer-motion"
import { MoreHorizontal, MessageSquare, Paperclip, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface TaskCardProps {
  task: {
    id: string
    title: string
    description?: string
    priority: "low" | "medium" | "high" | "critical"
    labels: Array<{ id: string; name: string; color: string }>
    assignees: Array<{ id: string; name: string; avatar?: string }>
    dueDate?: string
    commentsCount: number
    attachmentsCount: number
    subtasks: { completed: number; total: number }
  }
  isDragging?: boolean
  onEdit?: () => void
}

const priorityConfig = {
  low: { color: "text-green-500", bg: "bg-green-500" },
  medium: { color: "text-yellow-500", bg: "bg-yellow-500" },
  high: { color: "text-orange-500", bg: "bg-orange-500" },
  critical: { color: "text-red-500", bg: "bg-red-500" },
}

export function TaskCard({ task, isDragging, onEdit }: TaskCardProps) {
  return (
    <motion.div
      className={cn(
        "glass-card p-4 space-y-3 cursor-pointer group hover:shadow-lg transition-all duration-200",
        isDragging && "rotate-2 shadow-xl scale-105",
      )}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      animate={isDragging ? { rotate: 2, scale: 1.05 } : { rotate: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={onEdit}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          {/* Priority Indicator */}
          <div className={cn("w-2 h-2 rounded-full", priorityConfig[task.priority].bg)} />

          {/* Labels */}
          <div className="flex gap-1">
            {task.labels.slice(0, 2).map((label) => (
              <Badge
                key={label.id}
                variant="secondary"
                className="text-xs px-2 py-0"
                style={{ backgroundColor: label.color + "20", color: label.color }}
              >
                {label.name}
              </Badge>
            ))}
            {task.labels.length > 2 && (
              <Badge variant="secondary" className="text-xs px-2 py-0">
                +{task.labels.length - 2}
              </Badge>
            )}
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Edit task</DropdownMenuItem>
            <DropdownMenuItem>Duplicate</DropdownMenuItem>
            <DropdownMenuItem>Archive</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Title */}
      <h4 className="font-medium text-foreground leading-tight">{task.title}</h4>

      {/* Description */}
      {task.description && <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>}

      {/* Subtasks Progress */}
      {task.subtasks.total > 0 && (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Subtasks</span>
            <span>
              {task.subtasks.completed}/{task.subtasks.total}
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-1">
            <motion.div
              className="h-1 bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(task.subtasks.completed / task.subtasks.total) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        {/* Meta Info */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {task.commentsCount > 0 && (
            <div className="flex items-center gap-1">
              <MessageSquare className="w-3 h-3" />
              <span>{task.commentsCount}</span>
            </div>
          )}
          {task.attachmentsCount > 0 && (
            <div className="flex items-center gap-1">
              <Paperclip className="w-3 h-3" />
              <span>{task.attachmentsCount}</span>
            </div>
          )}
          {task.dueDate && (
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{task.dueDate}</span>
            </div>
          )}
        </div>

        {/* Assignees */}
        <div className="flex -space-x-1">
          {task.assignees.slice(0, 3).map((assignee) => (
            <Avatar key={assignee.id} className="w-6 h-6 border-2 border-background">
              <AvatarImage src={assignee.avatar || "/placeholder.svg"} alt={assignee.name} />
              <AvatarFallback className="text-xs">{assignee.name.charAt(0)}</AvatarFallback>
            </Avatar>
          ))}
          {task.assignees.length > 3 && (
            <div className="w-6 h-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
              <span className="text-xs text-muted-foreground">+{task.assignees.length - 3}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
