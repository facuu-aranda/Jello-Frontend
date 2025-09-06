"use client"

import * as React from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { KanbanBoard } from "@/components/kanban/kanban-board"
import { TaskModal } from "@/components/tasks/task-modal"
import { CreateTaskModal } from "@/components/modals/create-task-modal"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Settings, Users, Filter } from "lucide-react"

const mockProject = {
  id: "1",
  name: "Website Redesign",
  description: "Complete overhaul of the company website with modern design and improved UX",
  members: [
    { id: "1", name: "Sarah", avatar: "/sarah-avatar.png" },
    { id: "2", name: "Mike", avatar: "/mike-avatar.jpg" },
    { id: "3", name: "Alex", avatar: "/diverse-user-avatars.png" },
    { id: "4", name: "Emma", avatar: "/diverse-user-avatars.png" },
  ],
  isOwner: true,
}

export default function ProjectPage({ params }: { params: { projectId: string } }) {
  const [selectedTaskId, setSelectedTaskId] = React.useState<string | null>(null)
  const [isTaskModalOpen, setIsTaskModalOpen] = React.useState(false)
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = React.useState(false)
  const [selectedColumnId, setSelectedColumnId] = React.useState<string | null>(null)

  const handleTaskEdit = (taskId: string) => {
    setSelectedTaskId(taskId)
    setIsTaskModalOpen(true)
  }

  const handleAddTask = (columnId: string) => {
    setSelectedColumnId(columnId)
    setIsCreateTaskModalOpen(true)
  }

  const handleCreateTask = (taskData: any) => {
    console.log("Creating task:", taskData)
    // Here you would typically call an API to create the task
  }

  const handleUpdateTask = (taskData: any) => {
    console.log("Updating task:", taskData)
    // Here you would typically call an API to update the task
  }

  const handleDeleteTask = (taskId: string) => {
    console.log("Deleting task:", taskId)
    // Here you would typically call an API to delete the task
  }

  return (
    <AppLayout>
      <div className="flex flex-col h-full">
        {/* Project Header */}
        <div className="flex-shrink-0 glass-card p-6 mb-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-foreground">{mockProject.name}</h1>
                {mockProject.isOwner && (
                  <Badge variant="secondary" className="text-xs">
                    Owner
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground">{mockProject.description}</p>
            </div>

            <div className="flex items-center gap-3">
              {/* Members */}
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {mockProject.members.slice(0, 4).map((member) => (
                    <Avatar key={member.id} className="w-8 h-8 border-2 border-background">
                      <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                      <AvatarFallback className="text-xs">{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  ))}
                  {mockProject.members.length > 4 && (
                    <div className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                      <span className="text-xs text-muted-foreground">+{mockProject.members.length - 4}</span>
                    </div>
                  )}
                </div>
                <Button variant="ghost" size="sm">
                  <Users className="w-4 h-4 mr-2" />
                  Invite
                </Button>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="flex-1 overflow-hidden">
          <KanbanBoard onTaskEdit={handleTaskEdit} onAddTask={handleAddTask} />
        </div>

        {/* Task Modals */}
        <TaskModal
          isOpen={isTaskModalOpen}
          onClose={() => setIsTaskModalOpen(false)}
          taskId={selectedTaskId || undefined}
          onSubmit={handleUpdateTask}
          onDelete={handleDeleteTask}
        />

        <CreateTaskModal
          isOpen={isCreateTaskModalOpen}
          onClose={() => setIsCreateTaskModalOpen(false)}
          onSubmit={handleCreateTask}
          columnId={selectedColumnId || undefined}
          projectId={params.projectId}
        />
      </div>
    </AppLayout>
  )
}
