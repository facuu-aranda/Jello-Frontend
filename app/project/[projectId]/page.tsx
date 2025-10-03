"use client"

import * as React from 'react'
import { useParams } from 'next/navigation'
import { useApi } from '@/hooks/useApi'
import { ProjectDetails, TaskSummary, TaskDetails } from '@/types'
import { AppLayout } from '@/components/layout/app-layout'
import { KanbanBoard } from '@/components/kanban/kanban-board'
import { TaskModal } from '@/components/tasks/task-modal'
import { CreateTaskModal } from '@/components/modals/create-task-modal'
import { ProjectHeader } from '@/components/project-header' // This will now work
import { apiClient } from '@/lib/api'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'

export default function ProjectPage() {
  const params = useParams();
  const projectId = params.projectId as string;

  const { data: project, isLoading, error, refetch } = useApi<ProjectDetails>(`/projects/${projectId}`);
  
  const [selectedTask, setSelectedTask] = React.useState<TaskDetails | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = React.useState(false);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = React.useState(false);
  const [defaultStatusForCreate, setDefaultStatusForCreate] = React.useState<'todo' | 'in-progress' | 'review' | 'done'>('todo');

  const handleTaskClick = async (taskSummary: TaskSummary) => {
    try {
      const detailedTask = await apiClient.get<TaskDetails>(`/tasks/${taskSummary.id}`);
      setSelectedTask(detailedTask);
      setIsTaskModalOpen(true);
    } catch (err) {
      toast.error("Failed to load task details.");
    }
  }

  const handleTaskStatusChange = async (taskId: string, newStatus: string) => {
    if (!project) return;
    
    try {
        await apiClient.put(`/projects/${projectId}/tasks/${taskId}`, { status: newStatus });
        toast.success(`Task moved to "${newStatus}"`);
        refetch();
    } catch (err) {
        toast.error("Failed to update task status.");
    }
  };
  
  const handleOpenCreateTaskModal = (columnId: string) => {
    setDefaultStatusForCreate(columnId as 'todo' | 'in-progress' | 'review' | 'done');
    setIsCreateTaskModalOpen(true);
  }

  const handleCreateTask = async (taskData: Partial<TaskSummary>) => {
    try {
      await apiClient.post(`/projects/${projectId}/tasks`, { ...taskData, status: defaultStatusForCreate });
      toast.success("Task created successfully!");
      refetch();
    } catch (err) {
      toast.error("Failed to create task.");
    }
  };

  if (isLoading) {
    return (
        <AppLayout>
            <div className="p-8 space-y-6">
                <Skeleton className="h-12 w-1/3" />
                <Skeleton className="h-8 w-2/3" />
                <div className="flex gap-6 h-[calc(100vh-200px)]">
                    <Skeleton className="w-96 h-full" />
                    <Skeleton className="w-96 h-full" />
                    <Skeleton className="w-96 h-full" />
                </div>
            </div>
        </AppLayout>
    )
  }

  if (error) {
    return <AppLayout><div>Error loading project.</div></AppLayout>
  }

  if (!project) {
    return <AppLayout><div>Project not found.</div></AppLayout>
  }

  return (
    <>
      <AppLayout>
        <div className="flex flex-col h-full">
            <ProjectHeader project={project} />
            <KanbanBoard
                project={project}
                onTaskStatusChange={handleTaskStatusChange}
                onTaskClick={handleTaskClick}
                onAddTask={handleOpenCreateTaskModal}
            />
        </div>
      </AppLayout>

      {selectedTask && (
        <TaskModal
          isOpen={isTaskModalOpen}
          onClose={() => setIsTaskModalOpen(false)}
          task={selectedTask}
          onDataChange={refetch}
        />
      )}
      
      <CreateTaskModal
        isOpen={isCreateTaskModalOpen}
        onClose={() => setIsCreateTaskModalOpen(false)}
        onSubmit={handleCreateTask}
        defaultStatus={defaultStatusForCreate}
      />
    </>
  )
}