"use client"

import * as React from 'react'
import { useParams, useRouter } from 'next/navigation'
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

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
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
      // ✨ CORRECCIÓN: Usamos la ruta correcta de la API que incluye el projectId.
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

  const handleCreateTask = async (taskData: Partial<TaskSummary>) => {
    try {
      await apiClient.post(`/projects/${projectId}/tasks`, taskData);
      toast.success("Task created successfully!");
      refetch();
      setIsCreateTaskModalOpen(false);
    } catch (err) {
      toast.error(`Failed to create task: ${(err as Error).message}`);
    }
  };

  const handleEditProject = async (formData: FormData) => {
    if (!project) return;
    toast.info("Saving changes...");
    try {
      // 1. Esperamos a que la petición de actualización se complete.
      await apiClient.put(
        `/projects/${project.id}`,
        formData
      );
      
      // 2. ✨ EL CAMBIO CLAVE: Esperamos a que la recarga de datos termine.
      // Esto pausa la ejecución hasta que `refetch` haya obtenido los datos frescos
      // y actualizado el estado 'project' en el hook.
      await refetch();
      
      // 3. Solo después de que todo se haya actualizado, mostramos el éxito y cerramos el modal.
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
        {/* ✨ CORRECCIÓN: Ajustamos la estructura para un único contenedor de scroll */}
        <div className="flex flex-col h-full overflow-hidden">
            <ProjectHeader 
              project={project!} 
              onEdit={() => setIsEditModalOpen(true)}
              onInviteMembers={() => setIsInviteModalOpen(true)}
            />
            <div className="flex-1 overflow-x-auto">
              <KanbanBoard
                  project={project!}
                  onTaskStatusChange={handleTaskStatusChange}
                  onTaskClick={handleTaskClick}
                  onAddTask={handleOpenCreateTaskModal}
              />
            </div>
        </div>
      </AppLayout>

      {selectedTask && ( <TaskModal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} task={selectedTask} onDataChange={refetch} /> )}
      <CreateTaskModal isOpen={isCreateTaskModalOpen} onClose={() => setIsCreateTaskModalOpen(false)} onSubmit={handleCreateTask} defaultStatus={defaultStatusForCreate} projectId={projectId} />
      {project && <EditProjectModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} onSubmit={handleEditProject} onDelete={handleDeleteProject} project={project} onDataChange={refetch} />}
      {project && <AddMemberModal isOpen={isInviteModalOpen} onClose={() => setIsInviteModalOpen(false)} projectId={project.id} onInviteSent={refetch} currentMembers={project.members.map(m => m.id)} />}
    </>
  )
}

