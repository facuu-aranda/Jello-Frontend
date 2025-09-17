"use client"

import * as React from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { AssignedTasksWidget } from "@/components/dashboard/assigned-tasks-widget"
import { PersonalTodoWidget } from "@/components/dashboard/personal-todo-widget"
import { RecentActivityWidget } from "@/components/dashboard/recent-activity-widget"
import { ProjectCard } from "@/components/project-card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { CreateProjectModal } from "@/components/modals/create-project-modal"

const recentProjects = [
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
]

export default function DashboardPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false)
  return (

    <>
      <AppLayout>
        <div className="space-y-6 sm:space-y-8">
          {/* Header - Mobile responsive */}
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Good morning, John!</h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Here's what's happening with your projects today.
              </p>
            </div>
            <Button className="gap-2 w-full sm:w-auto" onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="w-4 h-4" />
              New Project
            </Button>
          </div>

          {/* Widgets Grid - Mobile responsive */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            <AssignedTasksWidget />
            <PersonalTodoWidget />
            <RecentActivityWidget />
          </div>

          {/* Recent Projects - Mobile responsive */}
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground">Recent Projects</h2>
              <Button variant="ghost" size="sm">
                View all projects
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {recentProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
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
