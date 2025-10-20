// app/dashboard/page.tsx

"use client"

import * as React from "react"
import Link from "next/link"
import { AppLayout } from "@/components/layout/app-layout"
import { AssignedTasksWidget } from "@/components/dashboard/assigned-tasks-widget"
import { PersonalTodoWidget } from "@/components/dashboard/personal-todo-widget"
import { RecentActivityWidget } from "@/components/dashboard/recent-activity-widget"
import { ProjectCard } from "@/components/project-card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus } from "lucide-react"
import { TaskModal } from "@/components/tasks/task-modal"
import { useApi } from "@/hooks/useApi"
import { ProjectSummary, TaskDetails, ProjectDetails as ProjectDetailsType, UserSummary } from "@/types"
import { useAuth } from "@/contexts/auth-context"
import { apiClient } from "@/lib/api"
import { toast } from "sonner"

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: recentProjects, isLoading: isLoadingProjects, refetch: refetchProjects } = useApi<ProjectSummary[]>('/projects?limit=3');
   const [selectedTask, setSelectedTask] = React.useState<TaskDetails | null>(null);
  const [projectMembersForTask, setProjectMembersForTask] = React.useState<UserSummary[]>([]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);


const handleTaskView = async (taskSummary: any) => {
    try {
      toast.info("Loading task details...");
      
      // Hacemos ambas peticiones en paralelo para más eficiencia
      const [taskDetails, projectDetails] = await Promise.all([
        apiClient.get<TaskDetails>(`/tasks/${taskSummary.id}`),
        apiClient.get<ProjectDetailsType>(`/projects/${taskSummary.projectId}`)
      ]);
      
      setSelectedTask(taskDetails);
      setProjectMembersForTask(projectDetails.members); // Guardamos los miembros
      setIsModalOpen(true);
      
      toast.dismiss();
    } catch (error) {
      toast.error("Failed to load task details.");
      toast.dismiss();
    }
  }
  
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
    setProjectMembersForTask([]);
  }

  return (
    <>
      <AppLayout>
        {/* --- MODIFICADO: Se añade un contenedor para centrar y limitar el ancho --- */}
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                Good morning, {(user?.name || 'Usuario').split(' ')[0]}!
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Here's what's happening with your projects today.
              </p>
            </div>
            <Button className="gap-2 w-full sm:w-auto">
              <Plus className="w-4 h-4" />
              New Project
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            <AssignedTasksWidget onTaskClick={handleTaskView} />
            <PersonalTodoWidget />
            <RecentActivityWidget />
          </div>

          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground">Recent Projects</h2>
              <Button asChild variant="ghost" size="sm">
                <Link href="/projects">View all projects</Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {isLoadingProjects ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} className="h-[260px] w-full rounded-2xl" />
                ))
              ) : (
                recentProjects?.map((project) => (
                  <ProjectCard key={project.id} project={project} onEdit={() => {}} />
                ))
              )}
            </div>
          </div>
        </div>
      </AppLayout>

       <TaskModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        task={selectedTask}
        onDataChange={refetchProjects}
        projectMembers={projectMembersForTask}
        showGoToProjectButton={true}
      />
    </>
  )
}