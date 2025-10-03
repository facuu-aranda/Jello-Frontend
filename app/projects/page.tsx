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

// Este tipo se usa internamente en el formulario.
interface ProjectFormData {
  name: string;
  description: string;
  color: string;
  members: string[];
  projectImage?: File;
  bannerImage?: File;
  dueDate?: string;
}

type FilterType = "all" | "owned" | "working";

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [filter, setFilter] = React.useState<FilterType>("all")
  
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

  // ✨ CORRECCIÓN: La función ahora acepta datos parciales y los valida.
  const handleCreateProject = async (projectData: Partial<ProjectFormData>) => {
    // 1. Validación
    if (!projectData.name || projectData.name.trim() === "") {
      toast.error("Project name is required.");
      return;
    }

    toast.info("Creating your new project...");
    try {
      const formData = new FormData();
      
      // 2. Construcción segura de datos
      const dataToSend = {
        name: projectData.name,
        description: projectData.description || '',
        color: projectData.color || 'bg-blue-500',
        dueDate: projectData.dueDate,
        members: (projectData.members || []).map((id: string) => ({ user: id, role: 'member' }))
      };
      formData.append('data', JSON.stringify(dataToSend));
  
      if (projectData.projectImage) {
        formData.append('projectImage', projectData.projectImage);
      }
      if (projectData.bannerImage) {
        formData.append('bannerImage', projectData.bannerImage);
      }
  
      await apiClient.post('/projects', formData);
      toast.success("Project created successfully!");
      refetch();
      setIsCreateModalOpen(false); // Cierra el modal al tener éxito
    } catch (error) {
      toast.error((error as Error).message);
    }
  }

  const handleEditProject = async (projectData: Partial<ProjectFormData>) => {
    if (!selectedProject) return;
    toast.info("Saving changes...");
    try {
      // NOTA: Asumimos que la API para editar puede recibir datos parciales.
      // Si la API requiere el objeto completo, necesitarías buscar los datos del `selectedProject`
      // y fusionarlos con `projectData` antes de enviar.
      await apiClient.put(`/projects/${selectedProject.id}`, projectData);
      toast.success("Project updated successfully!");
      refetch();
      setIsEditModalOpen(false);
    } catch (error) {
      toast.error((error as Error).message);
    }
  }

  const handleDeleteProject = async (projectId: string) => {
    if (!window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) return;
    toast.info("Deleting project...");
    try {
      await apiClient.del(`/projects/${projectId}`);
      toast.success("Project deleted successfully!");
      refetch();
      setIsEditModalOpen(false); // También cierra el modal de edición
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

          <Tabs value={filter} onValueChange={(value) => setFilter(value as FilterType)} className="space-y-4 sm:space-y-6">
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