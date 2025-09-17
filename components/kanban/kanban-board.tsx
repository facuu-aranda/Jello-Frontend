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
        description: "Create wireframes and mockups for the new homepage design.",
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
        subtasks: [
          { id: "sub-1-1", text: "Research competitor designs", completed: true },
          { id: "sub-1-2", text: "Create low-fidelity wireframes", completed: true },
          { id: "sub-1-3", text: "Develop color palette", completed: false },
          { id: "sub-1-4", text: "Design high-fidelity mockups", completed: false },
          { id: "sub-1-5", text: "Prepare assets for development", completed: false },
        ],
      },
      {
        id: "2",
        title: "Set up authentication system",
        description: "Implement JWT-based authentication with refresh tokens and password recovery.",
        priority: "critical" as const,
        labels: [{ id: "3", name: "Backend", color: "#14b8a6" }],
        assignees: [{ id: "3", name: "Alex", avatar: "/diverse-user-avatars.png" }],
        dueDate: "Dec 12",
        subtasks: [
          { id: "sub-2-1", text: "Configure database schema for users", completed: false },
          { id: "sub-2-2", text: "Create login/register endpoints", completed: false },
          { id: "sub-2-3", text: "Implement token generation", completed: false },
        ],
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
        description: "Build the main dashboard with widgets and analytics.",
        priority: "medium" as const,
        labels: [
          { id: "2", name: "Frontend", color: "#8b5cf6" },
          { id: "4", name: "React", color: "#00a3e0" },
        ],
        assignees: [{ id: "4", name: "Emma", avatar: "/diverse-user-avatars.png" }],
        dueDate: "Dec 20",
        subtasks: [
          { id: "sub-3-1", text: "Create Assigned Tasks widget", completed: true },
          { id: "sub-3-2", text: "Create Personal Todo widget", completed: true },
          { id: "sub-3-3", text: "Create Recent Activity widget", completed: true },
          { id: "sub-3-4", text: "Integrate with charting library", completed: false },
        ],
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
        description: "Write and publish comprehensive documentation for all public API endpoints.",
        priority: "low" as const,
        labels: [{ id: "5", name: "Documentation", color: "#10b981" }],
        assignees: [
          { id: "5", name: "John", avatar: "/diverse-user-avatars.png" },
          { id: "6", name: "Lisa", avatar: "/diverse-user-avatars.png" },
        ],
        dueDate: "Dec 22",
        subtasks: [
          { id: "sub-4-1", text: "Document /auth endpoints", completed: true },
          { id: "sub-4-2", text: "Document /projects endpoints", completed: true },
          { id: "sub-4-3", text: "Document /tasks endpoints", completed: true },
          { id: "sub-4-4", text: "Proofread all content", completed: true },
        ],
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
        description: "Configure the initial project structure, CI/CD pipeline, and dependencies.",
        priority: "medium" as const,
        labels: [{ id: "6", name: "Setup", color: "#6b7280" }],
        assignees: [{ id: "7", name: "Tom", avatar: "/diverse-user-avatars.png" }],
        dueDate: "Dec 1",
        subtasks: [
          { id: "sub-5-1", text: "Initialize Next.js project", completed: true },
          { id: "sub-5-2", text: "Set up ESLint and Prettier", completed: true },
        ],
      },
    ],
  },
]

interface KanbanBoardProps {
  onTaskView?: (task: any) => void;
  onTaskEdit?: (task: any) => void;
  onAddTask?: (columnId: string) => void;
}

export function KanbanBoard({ onTaskView, onTaskEdit, onAddTask }: KanbanBoardProps) {
  return (
    <div className="h-full overflow-x-auto">
      <motion.div className="flex gap-6 h-full min-w-max p-6" /* ... */>
        {mockColumns.map((column, index) => (
          <motion.div
            key={column.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <KanbanColumn column={column} onTaskView={onTaskView} onTaskEdit={onTaskEdit} onAddTask={onAddTask} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}