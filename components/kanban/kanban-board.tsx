    "use client"
    import { motion } from "framer-motion"
    import { KanbanColumn } from "./kanban-column"
    import { Task } from "@/lib/api/types"

    // La estructura de las columnas es generalmente fija en la UI.
    // Los datos dentro de ellas son los que cambian.
    const boardColumns = [
      { id: "todo", title: "To Do", color: "bg-gray-500" },
      { id: "in-progress", title: "In Progress", color: "bg-primary" },
      { id: "review", title: "Review", color: "bg-accent" },
      { id: "done", title: "Done", color: "bg-green-500" },
    ];

    interface KanbanBoardProps {
      tasksByStatus: { [key: string]: Task[] }; // Un objeto donde la clave es el status y el valor es un array de tareas
      onTaskEdit: (task: Task) => void;
      onAddTask: (columnId: string) => void;
    }

    export function KanbanBoard({ tasksByStatus, onTaskEdit, onAddTask }: KanbanBoardProps) {
      return (
        <div className="h-full overflow-x-auto">
          <motion.div
            className="flex gap-6 h-full min-w-max p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {boardColumns.map((column, index) => (
              <motion.div
                key={column.id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <KanbanColumn
                  column={{ ...column, tasks: tasksByStatus[column.id] || [] }}
                  onTaskEdit={onTaskEdit}
                  onAddTask={onAddTask}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      )
    }
    
