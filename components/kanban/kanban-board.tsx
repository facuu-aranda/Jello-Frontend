"use client"
import { motion } from "framer-motion"
import { KanbanColumn } from "./kanban-column"
import { ProjectDetails, TaskSummary } from "@/types" // Importamos los tipos

// CORREGIDO: Las props ahora reciben los datos del proyecto
interface KanbanBoardProps {
  project: ProjectDetails;
  onTaskView?: (task: TaskSummary) => void;
  onTaskEdit?: (task: TaskSummary) => void;
  onAddTask?: (columnId: string) => void;
}

// Mapeo de columnas para asegurar el orden y los metadatos
const columnsConfig = [
  { id: "todo", title: "To Do", color: "bg-gray-500" },
  { id: "in-progress", title: "In Progress", color: "bg-primary" },
  { id: "review", title: "Review", color: "bg-accent" },
  { id: "done", title: "Done", color: "bg-green-500" },
]

export function KanbanBoard({ project, onTaskView, onTaskEdit, onAddTask }: KanbanBoardProps) {
  return (
    <div className="h-full overflow-x-auto">
      <motion.div className="flex gap-6 h-full min-w-max p-6">
        {columnsConfig.map((columnConfig, index) => {
          // Obtenemos las tareas para esta columna desde los datos del proyecto
          const tasks = project.tasksByStatus[columnConfig.id as keyof typeof project.tasksByStatus] || [];
          const column = { ...columnConfig, tasks };

          return (
            <motion.div
              key={column.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <KanbanColumn column={column} onTaskView={onTaskView} onTaskEdit={onTaskEdit} onAddTask={onAddTask} />
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  )
}
