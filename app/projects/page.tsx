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
  {
    id: "4",
    name: "Backend API",
    description: "RESTful API development for the new platform",
    color: "bg-primary",
    progress: 60,
    totalTasks: 20,
    completedTasks: 12,
    members: [
      { id: "9", name: "David", avatar: "/diverse-user-avatars.png" },
      { id: "10", name: "Anna", avatar: "/diverse-user-avatars.png" },
    ],
    dueDate: "Dec 30",
    isOwner: true,
  },
  {
    id: "5",
    name: "User Research",
    description: "Comprehensive user research and usability testing",
    color: "bg-accent",
    progress: 25,
    totalTasks: 12,
    completedTasks: 3,
    members: [{ id: "11", name: "Sophie", avatar: "/diverse-user-avatars.png" }],
    dueDate: "Jan 30",
    isOwner: false,
  },
]

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

  const handleCreateProject = (projectData: any) => {
    console.log("Creating project:", projectData)
    // Here you would typically call an API to create the project
  }

  const handleEditProject = (projectData: any) => {
    console.log("Editing project:", projectData)
    // Here you would typically call an API to update the project
  }

  const handleDeleteProject = (projectId: string) => {
    console.log("Deleting project:", projectId)
    // Here you would typically call an API to delete the project
  }

  const openEditModal = (project: any) => {
    setSelectedProject(project)
    setIsEditModalOpen(true)
  }

  return (
    <AppLayout>
      <div className="space-y-6 sm:space-y-8">
        {/* Header - Mobile responsive */}
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

        {/* Search and Filters - Mobile responsive */}
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

        {/* Projects Tabs - Mobile responsive */}
        <Tabs defaultValue="all" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-3 sm:max-w-md">
            <TabsTrigger value="all" className="text-xs sm:text-sm">
              All Projects
            </TabsTrigger>
            <TabsTrigger value="owned" className="text-xs sm:text-sm">
              Owned ({ownedProjects.length})
            </TabsTrigger>
            <TabsTrigger value="working" className="text-xs sm:text-sm">
              Working ({workingProjects.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
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

        {/* Empty State - Mobile responsive */}
        {filterProjects(allProjects).length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <div className="glass-card p-6 sm:p-8 max-w-md mx-auto space-y-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                <Search className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-foreground">No projects found</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Try adjusting your search or create a new project.
              </p>
              <Button className="gap-2 w-full sm:w-auto" onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="w-4 h-4" />
                Create Project
              </Button>
            </div>
          </div>
        )}

        {/* Project Modals */}
        <CreateProjectModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateProject}
        />

        <EditProjectModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleEditProject}
          onDelete={handleDeleteProject}
          project={selectedProject}
        />
      </div>
    </AppLayout>
  )
}
