"use client"
import { motion } from "framer-motion"
import { Plus, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { TaskCard } from "@/components/tasks/task-card"
import { cn } from "@/lib/utils"

interface KanbanColumnProps {
  column: {
    id: string
    title: string
    color: string
    tasks: Array<{
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
    }>
  }
  onTaskEdit?: (taskId: string) => void
  onAddTask?: (columnId: string) => void
}

export function KanbanColumn({ column, onTaskEdit, onAddTask }: KanbanColumnProps) {
  return (
    <motion.div
      className="flex flex-col w-80 h-full"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Column Header */}
      <div className="glass-card p-4 mb-4 rounded-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn("w-3 h-3 rounded-full", column.color)} />
            <h3 className="font-semibold text-foreground">{column.title}</h3>
            <Badge variant="secondary" className="text-xs">
              {column.tasks.length}
            </Badge>
          </div>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="w-6 h-6" onClick={() => onAddTask?.(column.id)}>
              <Plus className="w-4 h-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="w-6 h-6">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Edit column</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onAddTask?.(column.id)}>Add task</DropdownMenuItem>
                <DropdownMenuItem>Clear completed</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">Delete column</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="flex-1 space-y-3 overflow-y-auto">
        {column.tasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <TaskCard task={task} onEdit={() => onTaskEdit?.(task.id)} />
          </motion.div>
        ))}

        {/* Add Task Button */}
        <motion.button
          className="w-full p-4 border-2 border-dashed border-border rounded-2xl text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
          onClick={() => onAddTask?.(column.id)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className="w-5 h-5 mx-auto mb-2" />
          <span className="text-sm">Add a task</span>
        </motion.button>
      </div>
    </motion.div>
  )
}
