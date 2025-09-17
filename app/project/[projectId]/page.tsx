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
import { ActivityItem } from "@/components/activity/ActivityItem"

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

const mockProjectActivities = [
  { id: 1, type: "comment", user: { name: "Sarah", avatar: "/sarah-avatar.png" }, action: "commented on", target: "Update homepage design", time: "2 minutes ago", projectId: 1 },
  { id: 4, type: "document", user: { name: "You", avatar: "/diverse-user-avatars.png" }, action: "uploaded", target: "API Documentation.pdf", time: "Yesterday", projectId: 1 },
];

export default function ProjectPage({ params }: { params: { projectId: string } }) {
  const [selectedTask, setSelectedTask] = React.useState<any | null>(null)
  const [modalMode, setModalMode] = React.useState<"view" | "edit">("view");
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = React.useState(false)
  const [selectedColumnId, setSelectedColumnId] = React.useState<string | null>(null)

  const handleTaskView = (task: any) => {
    setModalMode("view");
    setSelectedTask(task);
  }

  const handleTaskEdit = (task: any) => {
    setModalMode("edit");
    setSelectedTask(task);
  }

  const handleAddTask = (columnId: string) => {
    setSelectedColumnId(columnId)
    setIsCreateTaskModalOpen(true)
  }

  const handleCreateTask = (taskData: any) => { console.log("Creating task:", taskData) }
  const handleUpdateTask = (taskData: any) => { console.log("Updating task:", taskData) }
  const handleDeleteTask = (taskId: string) => { console.log("Deleting task:", taskId) }

  return (
    <AppLayout>
      <div className="flex flex-col h-full space-y-6">
        <div className="flex-shrink-0 glass-card p-6 rounded-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-foreground">{mockProject.name}</h1>
                {mockProject.isOwner && (
                  <Badge variant="secondary" className="text-xs">Owner</Badge>
                )}
              </div>
              <p className="text-muted-foreground">{mockProject.description}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {mockProject.members.slice(0, 4).map((member) => (
                    <Avatar key={member.id} className="w-8 h-8 border-2 border-background">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback className="text-xs">{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <Button variant="ghost" size="sm"><Users className="w-4 h-4 mr-2" />Invite</Button>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm"><Filter className="w-4 h-4 mr-2" />Filter</Button>
                <Button variant="outline" size="sm"><Settings className="w-4 h-4 mr-2" />Settings</Button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <KanbanBoard onTaskView={handleTaskView} onTaskEdit={handleTaskEdit} onAddTask={handleAddTask} />
        </div>
        <div className="flex-shrink-0 px-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Recent Activity</h2>
          <div className="glass-card p-4 rounded-2xl space-y-2">
            {mockProjectActivities.map((activity, index) => (
              <ActivityItem key={activity.id} activity={activity} index={index} />
            ))}
          </div>
        </div>
        <TaskModal
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          task={selectedTask}
          mode={modalMode}
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