"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { AppLayout } from "@/components/layout/app-layout"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select } from "@/components/ui/select"
import { Avatar } from "@/components/ui/avatar"
import { Icon } from "@/components/ui/icon"

interface Task {
  id: string
  title: string
  description: string
  status: "todo" | "in-progress" | "review" | "done"
  priority: "low" | "medium" | "high"
  project: {
    id: string
    name: string
    color: string
  }
  assignee: {
    name: string
    avatar: string
  }
  dueDate?: string
  labels: string[]
  subtasks: { completed: number; total: number }
  comments: number
  attachments: number
}

const mockTasks: Task[] = [
  {
    id: "1",
    title: "Design new user onboarding flow",
    description: "Create wireframes and mockups for the improved user onboarding experience",
    status: "in-progress",
    priority: "high",
    project: { id: "1", name: "Mobile App Redesign", color: "bg-blue-500" },
    assignee: { name: "You", avatar: "/sarah-avatar.png" },
    dueDate: "2024-01-15",
    labels: ["Design", "UX"],
    subtasks: { completed: 2, total: 5 },
    comments: 3,
    attachments: 2,
  },
  {
    id: "2",
    title: "Implement authentication system",
    description: "Set up JWT-based authentication with refresh tokens",
    status: "todo",
    priority: "high",
    project: { id: "2", name: "Backend API", color: "bg-green-500" },
    assignee: { name: "You", avatar: "/sarah-avatar.png" },
    dueDate: "2024-01-18",
    labels: ["Backend", "Security"],
    subtasks: { completed: 0, total: 3 },
    comments: 1,
    attachments: 0,
  },
  {
    id: "3",
    title: "Write unit tests for user service",
    description: "Comprehensive test coverage for all user-related operations",
    status: "review",
    priority: "medium",
    project: { id: "2", name: "Backend API", color: "bg-green-500" },
    assignee: { name: "You", avatar: "/sarah-avatar.png" },
    labels: ["Testing", "Backend"],
    subtasks: { completed: 4, total: 4 },
    comments: 2,
    attachments: 1,
  },
  {
    id: "4",
    title: "Update documentation",
    description: "Update API documentation with new endpoints",
    status: "done",
    priority: "low",
    project: { id: "3", name: "Documentation", color: "bg-purple-500" },
    assignee: { name: "You", avatar: "/sarah-avatar.png" },
    labels: ["Documentation"],
    subtasks: { completed: 2, total: 2 },
    comments: 0,
    attachments: 3,
  },
]

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "todo", label: "To Do" },
  { value: "in-progress", label: "In Progress" },
  { value: "review", label: "Review" },
  { value: "done", label: "Done" },
]

const priorityOptions = [
  { value: "all", label: "All Priorities" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
]

export default function MyTasksPage() {
  const [tasks] = useState<Task[]>(mockTasks)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || task.status === statusFilter
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "todo":
        return "bg-gray-500"
      case "in-progress":
        return "bg-blue-500"
      case "review":
        return "bg-yellow-500"
      case "done":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-50 dark:bg-red-900/20"
      case "medium":
        return "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20"
      case "low":
        return "text-green-600 bg-green-50 dark:bg-green-900/20"
      default:
        return "text-gray-600 bg-gray-50 dark:bg-gray-900/20"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "todo":
        return "To Do"
      case "in-progress":
        return "In Progress"
      case "review":
        return "Review"
      case "done":
        return "Done"
      default:
        return status
    }
  }

  const tasksByStatus = {
    todo: tasks.filter((t) => t.status === "todo").length,
    "in-progress": tasks.filter((t) => t.status === "in-progress").length,
    review: tasks.filter((t) => t.status === "review").length,
    done: tasks.filter((t) => t.status === "done").length,
  }

  return (
    <AppLayout>
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-jello-blue to-jello-blue-dark flex items-center justify-center">
              <Icon name="clipboard-list" className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Tasks</h1>
              <p className="text-gray-600 dark:text-gray-400">All tasks assigned to you across projects</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {Object.entries(tasksByStatus).map(([status, count]) => (
              <div key={status} className="glass-card p-4 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(status)}`} />
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{count}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{getStatusLabel(status)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="glass-card p-4 rounded-2xl mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter} options={statusOptions} />
              <Select value={priorityFilter} onValueChange={setPriorityFilter} options={priorityOptions} />
            </div>
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 rounded-2xl hover:shadow-lg transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className={`w-1 h-16 rounded-full ${task.project.color}`} />

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{task.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">{task.description}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor(task.priority)} variant="secondary">
                        {task.priority}
                      </Badge>
                      <Badge className={`text-white ${getStatusColor(task.status)}`}>
                        {getStatusLabel(task.status)}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${task.project.color}`} />
                        <span>{task.project.name}</span>
                      </div>

                      {task.dueDate && (
                        <div className="flex items-center gap-1">
                          <Icon name="calendar" className="w-4 h-4" />
                          <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-1">
                        <Icon name="check-square" className="w-4 h-4" />
                        <span>
                          {task.subtasks.completed}/{task.subtasks.total}
                        </span>
                      </div>

                      {task.comments > 0 && (
                        <div className="flex items-center gap-1">
                          <Icon name="message-circle" className="w-4 h-4" />
                          <span>{task.comments}</span>
                        </div>
                      )}

                      {task.attachments > 0 && (
                        <div className="flex items-center gap-1">
                          <Icon name="paperclip" className="w-4 h-4" />
                          <span>{task.attachments}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex gap-1">
                        {task.labels.map((label) => (
                          <Badge key={label} variant="outline" className="text-xs">
                            {label}
                          </Badge>
                        ))}
                      </div>

                      <Avatar src={task.assignee.avatar} alt={task.assignee.name} className="w-8 h-8" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {filteredTasks.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <Icon name="clipboard-list" className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No tasks found</h3>
              <p className="text-gray-500">
                {tasks.length === 0
                  ? "You don't have any tasks assigned yet."
                  : "Try adjusting your search or filters."}
              </p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
