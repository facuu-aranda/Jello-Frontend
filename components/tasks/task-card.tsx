"use client"
import * as React from 'react'
import { motion } from 'framer-motion'
import { TaskSummary } from '@/types'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { SquarePen, MessageSquare, Paperclip, Calendar, CheckCircle } from 'lucide-react'

interface TaskCardProps {
  task: TaskSummary;
}

const priorityClasses = {
  low: 'bg-green-500',
  medium: 'bg-yellow-500',
  high: 'bg-orange-500',
  critical: 'bg-red-500',
};

export function TaskCard({ task }: TaskCardProps) {
  const subtaskProgress = task.subtasks.total > 0 ? (task.subtasks.completed / task.subtasks.total) * 100 : 0;
  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="glass-card p-4 space-y-3 cursor-pointer group relative hover:shadow-lg transition-all duration-200"
      tabIndex={0}
    >
      <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <Button variant="ghost" size="icon" className="rounded-full h-7 w-7 bg-background/50 hover:bg-background/80">
          <SquarePen className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          <div className={cn("w-2 h-2 rounded-full", priorityClasses[task.priority])} />
          {task.labels.map(label => (
            <Badge key={label._id} variant="secondary" className="text-xs px-2 py-0" style={{ backgroundColor: label.color + '20', color: label.color }}>
              {label.name}
            </Badge>
          ))}
        </div>
      </div>
      
      <h4 className="font-medium text-foreground leading-tight pr-8">{task.title}</h4>

      {task.subtasks.total > 0 && (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Subtasks</span>
            <span>{task.subtasks.completed}/{task.subtasks.total}</span>
          </div>
          <Progress value={subtaskProgress} className="h-1" />
        </div>
      )}

      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {task.dueDate && (
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <MessageSquare className="w-3 h-3" />
            <span>{task.commentCount}</span>
          </div>
          <div className="flex items-center gap-1">
            <Paperclip className="w-3 h-3" />
            <span>{task.attachmentCount}</span>
          </div>
        </div>

        <div className="flex -space-x-1">
          {task.assignees.map(assignee => (
            <Avatar key={assignee.id} className="w-6 h-6 border-2 border-background">
              <AvatarImage src={assignee.avatarUrl || ''} alt={assignee.name} />
              <AvatarFallback className="text-xs">{assignee.name.charAt(0)}</AvatarFallback>
            </Avatar>
          ))}
        </div>
      </div>
    </motion.div>
  )
}