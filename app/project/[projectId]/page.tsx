"use client"

import * as React from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useApi } from '@/hooks/useApi'
import { ProjectDetails, TaskSummary, TaskDetails } from '@/types'
import { AppLayout } from '@/components/layout/app-layout'
import { KanbanBoard } from '@/components/kanban/kanban-board'
import { TaskModal } from '@/components/tasks/task-modal'
import { CreateTaskModal } from '@/components/modals/create-task-modal'
import { ProjectHeader } from '@/components/project-header'
import { EditProjectModal } from '@/components/modals/edit-project-modal'
import { AddMemberModal } from '@/components/modals/AddMemberModal'
import { apiClient } from '@/lib/api'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'
import type { DropResult } from '@hello-pangea/dnd';
import { ActivityFeed } from '@/components/activity/ActivityFeed'

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = params.projectId as string;

  const { data: project, isLoading, error, refetch, setData: setProject } = useApi<ProjectDetails>(`/projects/${projectId}`);

  const [selectedTask, setSelectedTask] = React.useState<TaskDetails | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = React.useState(false);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = React.useState(false);
  const [defaultStatusForCreate, setDefaultStatusForCreate] = React.useState<'todo' | 'in-progress' | 'review' | 'done'>('todo');

  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = React.useState(false);

  const handleTaskStatusChange = async (result: DropResult) => {
    if (!project) return;

    const { source, destination, draggableId } = result;
    if (!destination) return;

    const originalProject = { ...project };

    const sourceColumnId = source.droppableId as keyof ProjectDetails['tasksByStatus'];
    const destColumnId = destination.droppableId as keyof ProjectDetails['tasksByStatus'];

    const sourceTasks = [...originalProject.tasksByStatus[sourceColumnId]];
    const destTasks = source.droppableId === destination.droppableId ? sourceTasks : [...originalProject.tasksByStatus[destColumnId]];

    const [movedTask] = sourceTasks.splice(source.index, 1);

    if (!movedTask) return;

    movedTask.status = destColumnId;
    destTasks.splice(destination.index, 0, movedTask);

    const newProjectState = {
      ...originalProject,
      tasksByStatus: {
        ...originalProject.tasksByStatus,
        [sourceColumnId]: sourceTasks,
        [destColumnId]: destTasks,
      }
    };

    setProject(newProjectState);

    try {
      await apiClient.put(`/projects/${projectId}/tasks/${draggableId}`, { status: destColumnId });
    } catch (err) {
      toast.error("Failed to update task status. Reverting changes.");
      setProject(originalProject);
    }
  };

  const handleTaskClick = async (taskSummary: TaskSummary) => {
    try {
      toast.info("Loading task details...");
      const detailedTask = await apiClient.get<TaskDetails>(`/tasks/${taskSummary.id}`);
      setSelectedTask(detailedTask);
      setIsTaskModalOpen(true);
      toast.dismiss();
    } catch (err) {
      toast.error("Failed to load task details.");
    }
  }

  const handleOpenCreateTaskModal = (columnId: string) => {
    setDefaultStatusForCreate(columnId as 'todo' | 'in-progress' | 'review' | 'done');
    setIsCreateTaskModalOpen(true);
  }


  React.useEffect(() => {
    const taskIdFromUrl = searchParams.get('taskId');
    if (taskIdFromUrl && project) {
      // Buscamos la tarea en los datos del proyecto para evitar una llamada extra si ya la tenemos
      const taskSummary = Object.values(project.tasksByStatus).flat().find(t => t.id === taskIdFromUrl);
      if (taskSummary) {
        handleTaskClick(taskSummary);
        // Opcional: limpiar el parámetro de la URL para que no se vuelva a abrir al recargar
        router.replace(`/project/${projectId}`, { scroll: false });
      }
    }
  }, [searchParams, project, router, projectId]);

  const handleCreateTask = async (formData: FormData) => {
    setIsCreateTaskModalOpen(false);
    toast.info("Creating new task...");

    try {
      const newTask = await apiClient.post<TaskSummary>(`/projects/${projectId}/tasks`, formData);

      toast.success(`Task "${newTask.title}" created!`);

      // Refresca toda la data del proyecto para que la UI esté 100% sincronizada.
      refetch();

    } catch (err) {
      toast.error(`Failed to create task: ${(err as Error).message}`);
    }
  };

  // --- FIN DE LA CORRECCIÓN ---


  const handleEditProject = async (formData: FormData) => {
    if (!project) return;
    toast.info("Saving changes...");
    try {
      await apiClient.put(
        `/projects/${project.id}`,
        formData
      );

      await refetch();

      toast.success("Project updated successfully!");
      setIsEditModalOpen(false);

    } catch (error) {
      toast.error((error as Error).message);
    }
  }

  const handleDeleteProject = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) return;
    toast.info("Deleting project...");
    try {
      await apiClient.del(`/projects/${id}`);
      toast.success("Project deleted.");
      router.push('/projects');
    } catch (err) {
      toast.error((err as Error).message);
    }
  }

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
        <div className="space-y-6">
          <ProjectHeader
            project={project!}
            onEdit={() => setIsEditModalOpen(true)}
            onInviteMembers={() => setIsInviteModalOpen(true)}
          />
          <div className="min-h-[65vh]">
            <KanbanBoard
              project={project!}
              onTaskStatusChange={handleTaskStatusChange}
              onTaskClick={handleTaskClick}
              onAddTask={handleOpenCreateTaskModal}
            />
          </div>
          <div className="border-t border-border p-6">
            <ActivityFeed projectId={projectId} />
          </div>
        </div>
      </AppLayout>

      {selectedTask && ( 
        <TaskModal 
          isOpen={isTaskModalOpen} 
          onClose={() => setIsTaskModalOpen(false)} 
          task={selectedTask} 
          onDataChange={refetch}
          projectMembers={project.members}
        /> 
      )}

      <CreateTaskModal isOpen={isCreateTaskModalOpen} onClose={() => setIsCreateTaskModalOpen(false)} onSubmit={handleCreateTask} defaultStatus={defaultStatusForCreate} projectId={projectId} />

      {project && <EditProjectModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} onSubmit={handleEditProject} onDelete={handleDeleteProject} project={project} onDataChange={refetch} />}

      {project && <AddMemberModal isOpen={isInviteModalOpen} onClose={() => setIsInviteModalOpen(false)} projectId={project.id} onInviteSent={refetch} currentMembers={project.members.map(m => m.id)} />}
    </>
  )
}