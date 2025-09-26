"use client"

import * as React from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { KanbanBoard } from "@/components/kanban/kanban-board"
import { TaskModal } from "@/components/tasks/task-modal"
import { CreateTaskModal } from "@/components/modals/create-task-modal"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Settings, Users, Filter, AlertTriangle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useApi } from "@/hooks/useApi"
import { ProjectDetails, TaskDetails, TaskSummary } from "@/types"
import { apiClient } from "@/lib/api"
import { toast } from "sonner"

export default function ProjectPage({ params }: { params: { projectId: string } }) {
  const { data: project, isLoading, error, refetch } = useApi<ProjectDetails>(`/projects/${params.projectId}`);
  
  const [selectedTask, setSelectedTask] = React.useState<TaskDetails | null>(null)
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = React.useState(false)
  const [selectedColumnId, setSelectedColumnId] = React.useState<string | null>(null)

  const handleTaskView = async (taskSummary: TaskSummary) => {
    try {
      toast.info("Loading task details...");
      const taskDetails = await apiClient.get<TaskDetails>(`/tasks/${taskSummary.id}`);
      setSelectedTask(taskDetails);
      toast.dismiss();
    } catch (error) {
      toast.error("Failed to load task details.");
    }
  }

  const handleAddTask = (columnId: string) => {
    setSelectedColumnId(columnId)
    setIsCreateTaskModalOpen(true)
  }
  
  const handleCreateTask = async (taskData: any) => { 
    toast.info("Creating task...");
    try {
      await apiClient.post('/tasks', { ...taskData, project: params.projectId });
      toast.success("Task created successfully!");
      refetch();
    } catch (err) {
      toast.error((err as Error).message);
    }
  }
  
  const handleUpdateTask = async (taskData: Partial<TaskDetails>) => { 
    if (!selectedTask) return;
    toast.info("Saving changes...");
    try {
      await apiClient.put(`/tasks/${selectedTask.id}`, taskData);
      toast.success("Task updated!");
      refetch();
    } catch (err) {
      toast.error((err as Error).message);
    }
  }

  const handleDeleteTask = async (taskId: string) => { 
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    toast.info("Deleting task...");
    try {
        await apiClient.del(`/tasks/${taskId}`);
        toast.success("Task deleted!");
        refetch();
    } catch (err) {
        toast.error((err as Error).message);
    }
  }

  if (isLoading) {
    return <AppLayout><Skeleton className="h-full w-full rounded-2xl" /></AppLayout>
  }

  if (error || !project) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-full text-center">
          <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
          <h2 className="text-2xl font-bold">Error Loading Project</h2>
          <p className="text-muted-foreground">{error || "The project could not be found."}</p>
          <Button onClick={refetch} className="mt-6">Try Again</Button>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="flex flex-col h-full space-y-6">
        <div className="flex-shrink-0 glass-card p-6 rounded-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-foreground">{project.name}</h1>
                {project.isOwner && (
                  <Badge variant="secondary" className="text-xs">Owner</Badge>
                )}
              </div>
              <p className="text-muted-foreground">{project.description}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {project.members.slice(0, 4).map((member) => (
                    <Avatar key={member.id} className="w-8 h-8 border-2 border-background">
                      <AvatarImage src={member.avatarUrl || undefined} alt={member.name} />
                      <AvatarFallback className="text-xs">{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <Button variant="ghost" size="sm"><Users className="w-4 h-4 mr-2" />Invite</Button>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm"><Filter className="w-4 h-4 mr-2" />Filter</Button>
                <Button variant="outline" size="sm"><Settings className="w-4 h-4 mr-2" />Settings</Button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <KanbanBoard project={project} onTaskView={handleTaskView} onAddTask={handleAddTask} />
        </div>
        
        <TaskModal
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          task={selectedTask}
          mode="view"
          onSubmit={handleUpdateTask}
          onDelete={handleDeleteTask}
          onDataChange={refetch}
        />
        <CreateTaskModal
          isOpen={isCreateTaskModalOpen}
          onClose={() => setIsCreateTaskModalOpen(false)}
          onSubmit={handleCreateTask}
          columnId={selectedColumnId || undefined}
          projectId={params.projectId}
        />
      </div>
    </AppLayout>
  )
}

