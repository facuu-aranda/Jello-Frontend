"use client"

import * as React from "react"
import Link from "next/link"
import { AppLayout } from "@/components/layout/app-layout"
import { ProjectCard } from "@/components/project-card"
import { CreateProjectModal } from "@/components/modals/create-project-modal"
import { EditProjectModal } from "@/components/modals/edit-project-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, Filter } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { api } from "@/lib/api/client"
import { Project } from "@/lib/api/types"
import { useDebounce } from "@/hooks/useDebounce"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProjectsPage() {
  const { token } = useAuth();
  
  const [ownedProjects, setOwnedProjects] = React.useState<Project[]>([]);
  const [workingProjects, setWorkingProjects] = React.useState<Project[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = React.useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [selectedProject, setSelectedProject] = React.useState<Project | null>(null);

  const fetchProjects = React.useCallback(async () => {
    if (!token) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const searchParam = debouncedSearchQuery ? `?search=${debouncedSearchQuery}` : "";
      
      const [ownedRes, workingRes] = await Promise.all([
        api.get(`/projects/owned${searchParam}`, token),
        api.get(`/projects/working${searchParam}`, token)
      ]);

      setOwnedProjects(ownedRes);
      setWorkingProjects(workingRes);
    } catch (err: any) {
      setError(err.message || "Failed to fetch projects.");
    } finally {
      setIsLoading(false);
    }
  }, [token, debouncedSearchQuery]);

  React.useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);
  
  const allProjects = [...ownedProjects, ...workingProjects];

  const openEditModal = (project: Project) => {
    setSelectedProject(project);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setTimeout(() => setSelectedProject(null), 150);
  };

  const handleProjectAction = () => {
    fetchProjects();
  }

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-56 rounded-2xl" />)}
    </div>
  );

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
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="gap-2 w-full sm:w-auto bg-transparent">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </div>
          
          <Tabs defaultValue="all" className="space-y-4 sm:space-y-6">
            <TabsList className="grid w-full grid-cols-3 sm:max-w-md">
              <TabsTrigger value="all">All ({allProjects.length})</TabsTrigger>
              <TabsTrigger value="owned">Owned ({ownedProjects.length})</TabsTrigger>
              <TabsTrigger value="working">Working ({workingProjects.length})</TabsTrigger>
            </TabsList>
            
            {error && <p className="text-destructive text-center">{error}</p>}
            
            <TabsContent value="all">
              {isLoading ? <LoadingSkeleton /> : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {allProjects.map((project) => <ProjectCard key={project.id} project={project} onEdit={() => openEditModal(project)} />)}
                </div>
              )}
            </TabsContent>
            <TabsContent value="owned">
               {isLoading ? <LoadingSkeleton /> : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {ownedProjects.map((project) => <ProjectCard key={project.id} project={project} onEdit={() => openEditModal(project)} />)}
                </div>
              )}
            </TabsContent>
            <TabsContent value="working">
               {isLoading ? <LoadingSkeleton /> : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {workingProjects.map((project) => <ProjectCard key={project.id} project={project} onEdit={() => openEditModal(project)} />)}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </AppLayout>

      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onProjectCreated={handleProjectAction}
      />
      
      {selectedProject && (
        <EditProjectModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          onProjectUpdated={handleProjectAction}
          onProjectDeleted={handleProjectAction}
          project={selectedProject}
        />
      )}
    </>
  )
}
