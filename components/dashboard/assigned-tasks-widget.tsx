"use client"

import { motion } from "framer-motion"
import Link from "next/link" 
import { CheckCircle, Clock, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

const tasks = [
  {
    id: 1,
    title: "Update homepage design",
    project: "Website Redesign",
    priority: "high",
    dueDate: "Today",
    assignee: { name: "Sarah", avatar: "/sarah-avatar.png" },
  },
  {
    id: 2,
    title: "Fix login authentication bug",
    project: "Mobile App",
    priority: "critical",
    dueDate: "Tomorrow",
    assignee: { name: "Mike", avatar: "/mike-avatar.jpg" },
  },
  {
    id: 3,
    title: "Write API documentation",
    project: "Backend API",
    priority: "medium",
    dueDate: "Dec 15",
    assignee: { name: "You", avatar: "/diverse-user-avatars.png" },
  },
]

const priorityConfig = {
  low: { color: "bg-green-500", variant: "secondary" as const },
  medium: { color: "bg-yellow-500", variant: "secondary" as const },
  high: { color: "bg-orange-500", variant: "secondary" as const },
  critical: { color: "bg-red-500", variant: "destructive" as const },
}

export function AssignedTasksWidget() {
  return (
    <motion.div
      className="glass-card p-6 space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-foreground">My Tasks</h3>
          <p className="text-sm text-muted-foreground">Tasks assigned to you across all projects</p>
        </div>
        <Button variant="ghost" size="sm">
           <Link href="/tasks">View all</Link>
        </Button>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {tasks.map((task, index) => (
          <motion.div
            key={task.id}
            className="flex flex-wrap items-center gap-4 p-3 rounded-xl hover:bg-accent/50 transition-colors cursor-pointer"
            initial={{ opacity: 0}}
            animate={{ opacity: 1}}
            transition={{ delay: index * 0.1 }}
          >
            {/* Priority Indicator */}
            <div
              className={`w-3 h-3 rounded-full ${priorityConfig[task.priority as keyof typeof priorityConfig].color}`}
            />

            {/* Content */}
            <div className="flex-1 space-y-1">
              <h4 className="font-medium text-foreground">{task.title}</h4>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{task.project}</span>
              </div>
            </div>

            {/* Priority Badge */}
            <div className="flex gap-3 content-end">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{task.dueDate}</span>
                </div>
                <span>•</span>
            <Badge
            
              variant={priorityConfig[task.priority as keyof typeof priorityConfig].variant}
              className="capitalize"
            >
              {task.priority}
            </Badge>

            {/* Assignee */}
            <Avatar className="w-6 h-6">
              <AvatarImage src={task.assignee.avatar || "/placeholder.svg"} alt={task.assignee.name} />
              <AvatarFallback className="text-xs">{task.assignee.name.charAt(0)}</AvatarFallback>
            </Avatar>

            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
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
