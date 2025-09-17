"use client"

import * as React from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { ProjectCard } from "@/components/project-card"
import { CreateProjectModal } from "@/components/modals/create-project-modal"
import { EditProjectModal } from "@/components/modals/edit-project-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, Filter } from "lucide-react"

const allProjects = [
  {
    id: "1",
    name: "Website Redesign",
    description: "Complete overhaul of the company website with modern design and improved UX",
    color: "bg-accent-pink",
    progress: 75,
    totalTasks: 24,
    completedTasks: 18,
    members: [
      { id: "1", name: "Sarah", avatar: "/sarah-avatar.png" },
      { id: "2", name: "Mike", avatar: "/mike-avatar.jpg" },
      { id: "3", name: "Alex", avatar: "/diverse-user-avatars.png" },
    ],
    dueDate: "Dec 20",
    isOwner: true,
  },
  {
    id: "2",
    name: "Mobile App",
    description: "Native mobile application for iOS and Android platforms",
    color: "bg-accent-purple",
    progress: 45,
    totalTasks: 32,
    completedTasks: 14,
    members: [
      { id: "4", name: "Emma", avatar: "/diverse-user-avatars.png" },
      { id: "5", name: "John", avatar: "/diverse-user-avatars.png" },
    ],
    dueDate: "Jan 15",
    isOwner: false,
  },
  {
    id: "3",
    name: "Marketing Campaign",
    description: "Q1 marketing campaign for product launch",
    color: "bg-accent-teal",
    progress: 90,
    totalTasks: 16,
    completedTasks: 14,
    members: [
      { id: "6", name: "Lisa", avatar: "/diverse-user-avatars.png" },
      { id: "7", name: "Tom", avatar: "/diverse-user-avatars.png" },
      { id: "8", name: "Kate", avatar: "/diverse-user-avatars.png" },
    ],
    dueDate: "Dec 10",
    isOwner: false,
  },
];

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false)
  const [selectedProject, setSelectedProject] = React.useState<any>(null)

  const ownedProjects = allProjects.filter((project) => project.isOwner)
  const workingProjects = allProjects.filter((project) => !project.isOwner)

  const filterProjects = (projects: typeof allProjects) => {
    return projects.filter((project) => project.name.toLowerCase().includes(searchQuery.toLowerCase()))
  }

  const handleCreateProject = (projectData: any) => { console.log("Creating project:", projectData) }
  const handleEditProject = (projectData: any) => { console.log("Editing project:", projectData) }
  const handleDeleteProject = (projectId: string) => { console.log("Deleting project:", projectId) }

  // 👇 --- FUNCIÓN CLAVE PARA EVITAR EL CONGELAMIENTO --- 👇
  const openEditModal = (project: any) => {
    setTimeout(() => {
      setSelectedProject(project);
      setIsEditModalOpen(true);
    }, 50); 
  }

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setTimeout(() => {
        setSelectedProject(null);
    }, 150);
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
              <TabsTrigger value="all" className="text-xs sm:text-sm">All Projects</TabsTrigger>
              <TabsTrigger value="owned" className="text-xs sm:text-sm">Owned ({ownedProjects.length})</TabsTrigger>
              <TabsTrigger value="working" className="text-xs sm:text-sm">Working ({workingProjects.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filterProjects(allProjects).map((project) => (
                  <ProjectCard key={project.id} project={project} onEdit={() => openEditModal(project)} />
                ))}
              </div>
            </TabsContent>
            
                      <TabsContent value="owned" className="space-y-4 sm:space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                          {filterProjects(ownedProjects).map((project) => (
                            <ProjectCard key={project.id} project={project} onEdit={() => openEditModal(project)} />
                          ))}
                        </div>
                      </TabsContent>
            
                      <TabsContent value="working" className="space-y-4 sm:space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                          {filterProjects(workingProjects).map((project) => (
                            <ProjectCard key={project.id} project={project} onEdit={() => openEditModal(project)} />
                          ))}
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

      {/* El modal de edición solo se renderiza si hay un proyecto seleccionado */}
      {selectedProject && (
        <EditProjectModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          onSubmit={handleEditProject}
          onDelete={handleDeleteProject}
          project={selectedProject}
        />
      )}
    </>
  )
}