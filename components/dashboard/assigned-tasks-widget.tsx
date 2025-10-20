// components/dashboard/assigned-tasks-widget.tsx

"use client"

import * as React from "react"
import { motion } from "framer-motion"
import Link from "next/link" 
import { Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useApi } from "@/hooks/useApi"
import { TaskSummary } from "@/types"
import { Skeleton } from "@/components/ui/skeleton"

const priorityConfig = {
  low: { color: "bg-green-500", variant: "secondary" as const },
  medium: { color: "bg-yellow-500", variant: "secondary" as const },
  high: { color: "bg-orange-500", variant: "secondary" as const },
  critical: { color: "bg-red-500", variant: "destructive" as const },
}

// --- CAMBIO: Se añade la prop onTaskClick ---
interface AssignedTasksWidgetProps {
  onTaskClick: (task: TaskSummary) => void;
}

export function AssignedTasksWidget({ onTaskClick }: AssignedTasksWidgetProps) {
  const { data: tasks, isLoading } = useApi<TaskSummary[]>('/tasks/my-tasks?limit=3');

  return (
    <motion.div
      className="glass-card p-6 space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-foreground">My Tasks</h3>
          <p className="text-sm text-muted-foreground">Tasks assigned to you across all projects</p>
        </div>
        <Button variant="ghost" size="sm" asChild>
           <Link href="/tasks">View all</Link>
        </Button>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} className="h-16 w-full rounded-xl" />)
        ) : (
          tasks?.map((task, index) => (
            <motion.div
              key={task.id}
              className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer"
              initial={{ opacity: 0}}
              animate={{ opacity: 1}}
              transition={{ delay: index * 0.1 }}
              // --- CAMBIO: Se usa la prop onTaskClick ---
              onClick={() => onTaskClick(task)}
            >
              <div
                className={`w-3 h-3 rounded-full flex-shrink-0 ${priorityConfig[task.priority as keyof typeof priorityConfig].color}`}
              />
              <div className="flex-1 space-y-1 min-w-0">
                <h4 className="font-medium text-foreground truncate">{task.title}</h4>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {/* --- CORRECCIÓN: Usamos el nombre del proyecto, no el ID --- */}
                  <span className="truncate">{task.projectId}</span>
                </div>
              </div>
              <div className="flex gap-3 items-center text-xs text-muted-foreground">
                  {task.dueDate && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                    </div>
                  )}
                  <Badge
                    variant={priorityConfig[task.priority as keyof typeof priorityConfig].variant}
                    className="capitalize"
                  >
                    {task.priority}
                  </Badge>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  )
}
