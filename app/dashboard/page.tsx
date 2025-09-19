"use client"

import * as React from "react"
import Link from "next/link"
import { AppLayout } from "@/components/layout/app-layout"
import { AssignedTasksWidget } from "@/components/dashboard/assigned-tasks-widget"
import { PersonalTodoWidget } from "@/components/dashboard/personal-todo-widget"
import { RecentActivityWidget } from "@/components/dashboard/recent-activity-widget"
import { ProjectCard } from "@/components/project-card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { TaskModal } from "@/components/tasks/task-modal"
import { CreateProjectModal } from "@/components/modals/create-project-modal"
import { useAuth } from "@/contexts/AuthContext" // <-- Importamos el hook de Auth
import { Skeleton } from "@/components/ui/skeleton" // <-- Importamos el Skeleton para el estado de carga
import { api } from "@/lib/api/client" // <-- 1. Importar nuestro cliente de API
import { Project, Task, Todo, Activity } from "@/lib/api/types" // <-- 2. Importar nuestros tipos

export default function DashboardPage() {
  const { token, user } = useAuth(); // Obtenemos el token y el usuario del contexto

  // --- 3. Estados tipados correctamente ---
  const [recentProjects, setRecentProjects] = React.useState<Project[]>([]);
  const [assignedTasks, setAssignedTasks] = React.useState<Task[]>([]);
  const [personalTodos, setPersonalTodos] = React.useState<Todo[]>([]);
  const [recentActivity, setRecentActivity] = React.useState<Activity[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);

  React.useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token) {
          setIsLoading(false);
          return;
      };

      setIsLoading(true);
      try {
        // --- 4. Usamos nuestro cliente de API centralizado ---
        const [
          owned,
          working,
          tasks,
          todos,
          activity
        ] = await Promise.all([
          api.get('/projects/owned', token),
          api.get('/projects/working', token),
          api.get('/tasks/my-tasks', token),
          api.get('/todos', token),
          api.get('/activity/recent', token),
        ]);

        // Combinamos y ordenamos los proyectos (una lógica simple por ahora)
        const allProjects: Project[] = [...owned, ...working].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        
        setRecentProjects(allProjects.slice(0, 3));
        setAssignedTasks(tasks);
        setPersonalTodos(todos);
        setRecentActivity(activity);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        // Aquí podrías establecer un estado de error para mostrar un mensaje al usuario
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]); // El efecto se ejecuta cada vez que el token cambie

  // --- 3. Renderizado condicional para el estado de carga ---
  if (isLoading) {
    return (
      <AppLayout>
        <div className="space-y-8">
          {/* Skeleton para el Header */}
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-80" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
          {/* Skeleton para los Widgets */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
          {/* Skeleton para Proyectos Recientes */}
          <div className="space-y-6">
            <Skeleton className="h-6 w-48" />
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              <Skeleton className="h-56" />
              <Skeleton className="h-56" />
              <Skeleton className="h-56" />
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }
  return (
    <>
      <AppLayout>
        <div className="space-y-6 sm:space-y-8">
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <div className="space-y-1">
              {/* Saludamos al usuario con su nombre */}
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Good morning, {user?.name || 'User'}!</h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Here's what's happening with your projects today.
              </p>
            </div>
            <Button className="gap-2 w-full sm:w-auto" onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="w-4 h-4" />
              New Project
            </Button>
          </div>

          {/* Pasamos los datos fetcheados como props a los widgets */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            <AssignedTasksWidget tasks={assignedTasks} />
            <PersonalTodoWidget initialTodos={personalTodos} />
            <RecentActivityWidget activities={recentActivity} />
          </div>

          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground">Recent Projects</h2>
              <Button asChild variant="ghost" size="sm">
                <Link href="/projects">View all projects</Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {recentProjects.map((project: any) => (
                <ProjectCard key={project.id} project={project} onEdit={() => { /* Lógica de edición */}} />
              ))}
            </div>
          </div>
        </div>
      </AppLayout>
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={(data) => console.log("Creating project:", data)}
      />
    </>
  )
}