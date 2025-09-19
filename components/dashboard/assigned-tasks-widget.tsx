"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { CheckCircle, Clock, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Task } from "@/lib/api/types" // Importa el tipo Task

const priorityConfig = {
  low: { color: "bg-green-500", variant: "secondary" as const },
  medium: { color: "bg-yellow-500", variant: "secondary" as const },
  high: { color: "bg-orange-500", variant: "secondary" as const },
  critical: { color: "bg-red-500", variant: "destructive" as const },
}

interface AssignedTasksWidgetProps {
  tasks: Task[];
}

export function AssignedTasksWidget({ tasks }: AssignedTasksWidgetProps) {
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
        <Button variant="ghost" size="sm">
          <Link href="/tasks">View all</Link>
        </Button>
      </div>

      <div className="space-y-4">
        {/* Se añade un estado para cuando no hay tareas */}
        {tasks.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground">You have no assigned tasks. Great job!</p>
          </div>
        ) : (
          tasks.slice(0, 3).map((task, index) => {
            const firstAssignee = task.assignees && task.assignees[0];

            return (
              <motion.div
                key={task.id}
                className="flex flex-wrap items-center gap-4 p-3 rounded-xl hover:bg-accent/50 transition-colors cursor-pointer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className={`w-3 h-3 rounded-full ${priorityConfig[task.priority].color}`} />
                <div className="flex-1 space-y-1">
                  <h4 className="font-medium text-foreground">{task.title}</h4>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{task.project}</span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{task.dueDate || 'No due date'}</span>
                    </div>
                  </div>
                </div>
                <Badge variant={priorityConfig[task.priority].variant} className="capitalize">
                  {task.priority}
                </Badge>
                
                {firstAssignee && (
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={firstAssignee.avatarUrl || "/placeholder.svg"} alt={firstAssignee.name} />
                    <AvatarFallback className="text-xs">{firstAssignee.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
              </motion.div>
            )
          })
        )}
      </div>

      <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
        <Button variant="outline" size="sm" className="flex-1 bg-transparent">
          <CheckCircle className="w-4 h-4 mr-2" />
          Mark Complete
        </Button>
        <Button variant="outline" size="sm" className="flex-1 bg-transparent">
          <AlertCircle className="w-4 h-4 mr-2" />
          Need Help
        </Button>
      </div>
    </motion.div>
  )
}