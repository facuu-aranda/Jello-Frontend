    "use client"

    import * as React from "react"
    import { useParams } from "next/navigation"
    import { AppLayout } from "@/components/layout/app-layout"
    import { KanbanBoard } from "@/components/kanban/kanban-board"
    import { TaskModal } from "@/components/tasks/task-modal"
    import { CreateTaskModal } from "@/components/modals/create-task-modal"
    import { Button } from "@/components/ui/button"
    import { Badge } from "@/components/ui/badge"
    import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
    import { Settings, Users, Filter } from "lucide-react"
    import { ActivityItem } from "@/components/activity/ActivityItem"
    import { useAuth } from "@/contexts/AuthContext"
    import { api } from "@/lib/api/client"
    import { Project, Task, Activity } from "@/lib/api/types"
    import { Skeleton } from "@/components/ui/skeleton"

    export default function ProjectPage() {
      const { token } = useAuth();
      const params = useParams();
      const projectId = params.projectId as string;

      const [project, setProject] = React.useState<Project | null>(null);
      const [tasks, setTasks] = React.useState<Task[]>([]);
      const [activities, setActivities] = React.useState<Activity[]>([]);
      const [isLoading, setIsLoading] = React.useState(true);
      const [error, setError] = React.useState<string | null>(null);

      const [selectedTask, setSelectedTask] = React.useState<Task | null>(null);
      const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = React.useState(false);
      const [selectedColumnId, setSelectedColumnId] = React.useState<string | null>(null);

      React.useEffect(() => {
        const fetchProjectData = async () => {
          if (!token || !projectId) return;

          setIsLoading(true);
          setError(null);
          try {
            const [projectDetails, projectTasks] = await Promise.all([
              api.get(`/projects/${projectId}`, token),
              api.get(`/projects/${projectId}/tasks`, token)
            ]);
            setProject(projectDetails);
            setTasks(projectTasks);
            // Podríamos tener un endpoint de actividad por proyecto, por ahora lo dejamos vacío
            // const projectActivities = await api.get(`/projects/${projectId}/activity`, token);
            // setActivities(projectActivities);
          } catch (err: any) {
            setError(err.message || "Failed to load project data.");
          } finally {
            setIsLoading(false);
          }
        };

        fetchProjectData();
      }, [projectId, token]);

      // Usamos useMemo para agrupar las tareas por estado, optimizando el rendimiento.
      // Este cálculo solo se re-ejecutará si el array de 'tasks' cambia.
      const tasksByStatus = React.useMemo(() => {
        return tasks.reduce((acc, task) => {
          const status = task.status;
          if (!acc[status]) {
            acc[status] = [];
          }
          acc[status].push(task);
          return acc;
        }, {} as { [key: string]: Task[] });
      }, [tasks]);
      
      const handleAddTask = (columnId: string) => {
        setSelectedColumnId(columnId);
        setIsCreateTaskModalOpen(true);
      };

      const handleTaskCreated = (newTask: Task) => {
        setTasks(prevTasks => [...prevTasks, newTask]);
      };

      const handleTaskUpdated = (updatedTask: Task) => {
        setTasks(prevTasks => prevTasks.map(task => task.id === updatedTask.id ? updatedTask : task));
      };

      const handleTaskDeleted = (taskId: string) => {
        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      };

      if (isLoading) {
        return <AppLayout><Skeleton className="w-full h-full" /></AppLayout>;
      }

      if (error || !project) {
        return <AppLayout><div className="text-center text-destructive">{error || "Project not found."}</div></AppLayout>;
      }

      return (
        <AppLayout>
          <div className="flex flex-col h-full space-y-6">
            <div className="flex-shrink-0 glass-card p-6 rounded-2xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-foreground">{project.name}</h1>
                    {project.isOwner && <Badge variant="secondary" className="text-xs">Owner</Badge>}
                  </div>
                  <p className="text-muted-foreground">{project.description}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex -space-x-2">
                      {project.members.slice(0, 4).map((member) => (
                        <Avatar key={member.id} className="w-8 h-8 border-2 border-background">
                          <AvatarImage src={member.avatarUrl} alt={member.name} />
                          <AvatarFallback className="text-xs">{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                    <Button variant="ghost" size="sm"><Users className="w-4 h-4 mr-2" />Invite</Button>
                    <Button variant="outline" size="sm"><Settings className="w-4 h-4 mr-2" />Settings</Button>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-hidden">
              <KanbanBoard tasksByStatus={tasksByStatus} onTaskEdit={setSelectedTask} onAddTask={handleAddTask} />
            </div>

            <TaskModal
              isOpen={!!selectedTask}
              onClose={() => setSelectedTask(null)}
              task={selectedTask}
              onTaskUpdated={handleTaskUpdated}
              onTaskDeleted={handleTaskDeleted}
            />

            <CreateTaskModal
              isOpen={isCreateTaskModalOpen}
              onClose={() => setIsCreateTaskModalOpen(false)}
              onTaskCreated={handleTaskCreated}
              columnId={selectedColumnId || undefined}
              projectId={projectId}
            />
          </div>
        </AppLayout>
      )
    }
    
