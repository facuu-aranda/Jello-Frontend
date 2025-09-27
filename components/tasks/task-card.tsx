"use client"
import { motion } from "framer-motion"
import { Calendar, Edit, MessageSquare, Paperclip } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface Label { id: string; name: string; color: string; }
interface Assignee { id: string; name: string; avatar?: string; }
interface SubtasksInfo { completed: number; total: number; }

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    labels?: Label[];
    assignees?: Assignee[];
    dueDate?: string | null;
    subtasks?: SubtasksInfo;
    commentsCount?: number;
    attachmentsCount?: number;
  };
  onView?: () => void;
  onEdit?: () => void;
  isDragging?: boolean;
}

const priorityConfig = {
  low: { bg: "bg-green-500" }, medium: { bg: "bg-yellow-500" },
  high: { bg: "bg-orange-500" }, critical: { bg: "bg-red-500" },
}

export function TaskCard({ task, onView, onEdit, isDragging }: TaskCardProps) {
  const { subtasks, commentsCount = 0, attachmentsCount = 0 } = task;
  const subtasksCompleted = subtasks?.completed ?? 0;
  const subtasksTotal = subtasks?.total ?? 0;

  return (
    <TooltipProvider>
      <motion.div
        className={cn("glass-card p-4 space-y-3 cursor-pointer group relative hover:shadow-lg transition-all duration-200", isDragging && "rotate-2 shadow-xl scale-105")}
        onClick={onView}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        animate={isDragging ? { rotate: 2, scale: 1.05 } : { rotate: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7 bg-background/50 hover:bg-background/80" onClick={(e) => { e.stopPropagation(); onEdit?.(); }}>
                <Edit className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Edit Task</TooltipContent>
          </Tooltip>
        </div>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            <div className={cn("w-2 h-2 rounded-full", priorityConfig[task.priority]?.bg)} />
            {(task.labels || []).slice(0, 2).map((label) => (
              <Badge key={label.id} variant="secondary" className="text-xs px-2 py-0" style={{ backgroundColor: label.color + "20", color: label.color }}>{label.name}</Badge>
            ))}
          </div>
        </div>
        <h4 className="font-medium text-foreground leading-tight pr-8">{task.title}</h4>
        {subtasksTotal > 0 && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Subtasks</span>
              <span>{subtasksCompleted}/{subtasksTotal}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-1"><motion.div className="h-1 bg-primary rounded-full" initial={{ width: 0 }} animate={{ width: `${(subtasksCompleted / subtasksTotal) * 100}%` }} /></div>
          </div>
        )}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {task.dueDate && <div className="flex items-center gap-1"><Calendar className="w-3 h-3" /><span>{task.dueDate}</span></div>}
            {commentsCount > 0 && <div className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /><span>{commentsCount}</span></div>}
            {attachmentsCount > 0 && <div className="flex items-center gap-1"><Paperclip className="w-3 h-3" /><span>{attachmentsCount}</span></div>}
          </div>
          <div className="flex -space-x-1">
            {/* CORRECCIÓN: Se añade '|| []' para evitar el error si 'assignees' es undefined */}
            {(task.assignees || []).map((assignee) => (
              <Avatar key={assignee.id} className="w-6 h-6 border-2 border-background">
                <AvatarImage src={assignee.avatar} alt={assignee.name} />
                <AvatarFallback className="text-xs">{assignee.name.charAt(0)}</AvatarFallback>
              </Avatar>
            ))}
          </div>
        </div>
      </motion.div>
    </TooltipProvider>
  )
}