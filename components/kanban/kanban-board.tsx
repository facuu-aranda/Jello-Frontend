"use client"
import { motion } from "framer-motion"
import { KanbanColumn } from "./kanban-column"

const mockColumns = [
  {
    id: "todo",
    title: "To Do",
    color: "bg-gray-500",
    tasks: [
      {
        id: "1",
        title: "Design new homepage layout",
        description: "Create wireframes and mockups for the new homepage design",
        priority: "high" as const,
        labels: [
          { id: "1", name: "Design", color: "#ec4899" },
          { id: "2", name: "Frontend", color: "#8b5cf6" },
        ],
        assignees: [
          { id: "1", name: "Sarah", avatar: "/sarah-avatar.png" },
          { id: "2", name: "Mike", avatar: "/mike-avatar.jpg" },
        ],
        dueDate: "Dec 15",
        commentsCount: 3,
        attachmentsCount: 2,
        subtasks: { completed: 2, total: 5 },
      },
      {
        id: "2",
        title: "Set up authentication system",
        priority: "critical" as const,
        labels: [{ id: "3", name: "Backend", color: "#14b8a6" }],
        assignees: [{ id: "3", name: "Alex", avatar: "/diverse-user-avatars.png" }],
        dueDate: "Dec 12",
        commentsCount: 1,
        attachmentsCount: 0,
        subtasks: { completed: 0, total: 3 },
      },
    ],
  },
  {
    id: "in-progress",
    title: "In Progress",
    color: "bg-primary",
    tasks: [
      {
        id: "3",
        title: "Implement user dashboard",
        description: "Build the main dashboard with widgets and analytics",
        priority: "medium" as const,
        labels: [
          { id: "2", name: "Frontend", color: "#8b5cf6" },
          { id: "4", name: "React", color: "#00a3e0" },
        ],
        assignees: [{ id: "4", name: "Emma", avatar: "/diverse-user-avatars.png" }],
        dueDate: "Dec 20",
        commentsCount: 5,
        attachmentsCount: 1,
        subtasks: { completed: 3, total: 4 },
      },
    ],
  },
  {
    id: "review",
    title: "Review",
    color: "bg-accent",
    tasks: [
      {
        id: "4",
        title: "API documentation",
        priority: "low" as const,
        labels: [{ id: "5", name: "Documentation", color: "#10b981" }],
        assignees: [
          { id: "5", name: "John", avatar: "/diverse-user-avatars.png" },
          { id: "6", name: "Lisa", avatar: "/diverse-user-avatars.png" },
        ],
        commentsCount: 2,
        attachmentsCount: 3,
        subtasks: { completed: 4, total: 4 },
      },
    ],
  },
  {
    id: "done",
    title: "Done",
    color: "bg-green-500",
    tasks: [
      {
        id: "5",
        title: "Project setup and configuration",
        priority: "medium" as const,
        labels: [{ id: "6", name: "Setup", color: "#6b7280" }],
        assignees: [{ id: "7", name: "Tom", avatar: "/diverse-user-avatars.png" }],
        commentsCount: 1,
        attachmentsCount: 0,
        subtasks: { completed: 2, total: 2 },
      },
    ],
  },
]

interface KanbanBoardProps {
  onTaskEdit?: (taskId: string) => void
  onAddTask?: (columnId: string) => void
}

export function KanbanBoard({ onTaskEdit, onAddTask }: KanbanBoardProps) {
  return (
    <div className="h-full overflow-x-auto">
      <motion.div
        className="flex gap-6 h-full min-w-max p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {mockColumns.map((column, index) => (
          <motion.div
            key={column.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <KanbanColumn column={column} onTaskEdit={onTaskEdit} onAddTask={onAddTask} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
