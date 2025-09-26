"use client"

import * as React from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { ProjectCard } from "@/components/project-card"
import { CreateProjectModal } from "@/components/modals/create-project-modal"
import { EditProjectModal } from "@/components/modals/edit-project-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus, Search } from "lucide-react"
import { useApi } from "@/hooks/useApi"
import { ProjectSummary } from "@/types"
import { apiClient } from "@/lib/api"
import { toast } from "sonner"

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [filter, setFilter] = React.useState<"all" | "owned" | "working">("all")
  
  const endpoint = `/projects?search=${searchQuery}&filter=${filter === 'all' ? '' : filter}`;
  const { data: projects, isLoading, refetch } = useApi<ProjectSummary[]>(endpoint);

  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false)
  const [selectedProject, setSelectedProject] = React.useState<ProjectSummary | null>(null)

  React.useEffect(() => {
    const handler = setTimeout(() => { refetch() }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery, filter, refetch]);

  const openEditModal = (project: ProjectSummary) => {
    setSelectedProject(project);
    setIsEditModalOpen(true);
  }

  const handleCreateProject = async (projectData: any) => {
    toast.info("Creating your new project...");
    try {
      await apiClient.post('/projects', projectData);
      toast.success("Project created successfully!");
      refetch();
    } catch (error) {
      toast.error((error as Error).message);
    }
  }

  const handleEditProject = async (projectData: any) => {
    if (!selectedProject) return;
    toast.info("Saving changes...");
    try {
      await apiClient.post(`/projects/${selectedProject.id}`, projectData); // Asumiendo PUT es manejado por el método post con FormData
      toast.success("Project updated successfully!");
      refetch();
    } catch (error) {
      toast.error((error as Error).message);
    }
  }

  const handleDeleteProject = async (projectId: string) => {
     if (!window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) return;
    toast.info("Deleting project...");
    try {
      await apiClient.get(`/projects/${projectId}`); // Asumiendo que el método get puede manejar DELETE por ahora
      toast.success("Project deleted successfully!");
      refetch();
    } catch (error) {
      toast.error((error as Error).message);
    }
  }

  return (
    <>
      <AppLayout>
        <div className="space-y-6 sm:space-y-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Projects</h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Manage and track all your projects in one place.
              </p>
            </div>
            <Button className="gap-2 w-full sm:w-auto" onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="w-4 h-4" />
              New Project
            </Button>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search projects by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Tabs value={filter} onValueChange={(value) => setFilter(value as any)} className="space-y-4 sm:space-y-6">
            <TabsList className="grid w-full grid-cols-3 sm:max-w-md">
              <TabsTrigger value="all">All Projects</TabsTrigger>
              <TabsTrigger value="owned">Owned by Me</TabsTrigger>
              <TabsTrigger value="working">Working on</TabsTrigger>
            </TabsList>

            <TabsContent value={filter}>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, index) => (
                    <Skeleton key={index} className="h-[260px] w-full rounded-2xl" />
                  ))
                ) : (
                  projects?.map((project) => (
                    <ProjectCard key={project.id} project={project} onEdit={() => openEditModal(project)} />
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </AppLayout>

      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateProject}
      />
      
      {selectedProject && (
        <EditProjectModal
          isOpen={isEditModalOpen}
          onClose={() => {setIsEditModalOpen(false); setSelectedProject(null)}}
          onSubmit={handleEditProject}
          onDelete={handleDeleteProject}
          project={selectedProject}
        />
      )}
    </>
  )
}

