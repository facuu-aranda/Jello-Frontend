"use client"

import * as React from "react" // NUEVO: Importar React completo
import { motion } from "framer-motion"
import Link from "next/link" 
import { Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
// --- NUEVO: Imports necesarios ---
import { useApi } from "@/hooks/useApi"
import { TaskSummary, TaskDetails } from "@/types"
import { Skeleton } from "@/components/ui/skeleton"
import { TaskModal } from "@/components/tasks/task-modal"
import { apiClient } from "@/lib/api"
import { toast } from "sonner"

const priorityConfig = {
  low: { color: "bg-green-500", variant: "secondary" as const },
  medium: { color: "bg-yellow-500", variant: "secondary" as const },
  high: { color: "bg-orange-500", variant: "secondary" as const },
  critical: { color: "bg-red-500", variant: "destructive" as const },
}

export function AssignedTasksWidget() {
  // --- NUEVO: Llamada a la API y estado para el modal ---
  const { data: tasks, isLoading, refetch } = useApi<TaskSummary[]>('/tasks/my-tasks?limit=3');
  const [selectedTask, setSelectedTask] = React.useState<TaskDetails | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleTaskView = async (taskSummary: TaskSummary) => {
    try {
      toast.info("Loading task details...");
      const taskDetails = await apiClient.get<TaskDetails>(`/tasks/${taskSummary.id}`);
      setSelectedTask(taskDetails);
      setIsModalOpen(true);
      toast.dismiss();
    } catch (error) {
      toast.error("Failed to load task details.");
    }
  }

  return (
    <>
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
          <Button variant="ghost" size="sm" asChild>
             <Link href="/tasks">View all</Link>
          </Button>
        </div>

        {/* --- MODIFICADO: Lógica para mostrar Skeletons o Tareas Reales --- */}
        <div className="space-y-4">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} className="h-16 w-full rounded-xl" />)
          ) : (
            tasks?.map((task, index) => (
              <motion.div
                key={task.id}
                className="flex flex-wrap items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer"
                initial={{ opacity: 0}}
                animate={{ opacity: 1}}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleTaskView(task)}
              >
                <div
                  className={`w-3 h-3 rounded-full ${priorityConfig[task.priority as keyof typeof priorityConfig].color}`}
                />
                <div className="flex-1 space-y-1">
                  <h4 className="font-medium text-foreground">{task.title}</h4>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{task.projectId}</span> {/* Ajustar si el backend envía el nombre del proyecto */}
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
      
      {/* --- NUEVO: Modal para ver detalles de la tarea --- */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        task={selectedTask}
        onDataChange={refetch}
        showGoToProjectButton={true}
      />
    </>
  )
}