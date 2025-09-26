"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AppLayout } from "@/components/layout/app-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Icon } from "@/components/ui/icon"
import { Progress } from "@/components/ui/progress"
import { Trash2, Plus, CheckSquare, AlertTriangle } from "lucide-react"
import { DatePicker } from "@/components/ui/date-picker"
import { useApi } from "@/hooks/useApi"
import { apiClient } from "@/lib/api"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import { Todo } from "@/types" 
import * as React from "react"

const categories = ["All", "Work", "Personal", "Projects", "Health"]
const priorities = [
  { value: "All", label: "All" }, { value: "high", label: "High" },
  { value: "medium", label: "Medium" }, { value: "low", label: "Low" }
]

export default function PersonalTodosPage() {
  const { data: todos, isLoading, error, refetch } = useApi<Todo[]>('/todos');
  
  const [isAdding, setIsAdding] = useState(false)
  const [newTodoText, setNewTodoText] = useState("")
  const [newTodoPriority, setNewTodoPriority] = useState<Todo['priority']>("medium")
  const [newTodoCategory, setNewTodoCategory] = useState("Personal")
  const [newTodoDueDate, setNewTodoDueDate] = useState<Date | undefined>()

  const [filterCategory, setFilterCategory] = useState("All")
  const [filterPriority, setFilterPriority] = useState("All")
  const [showCompleted, setShowCompleted] = useState(true)
  const [isManaging, setIsManaging] = useState(false)

  const addTodo = async () => {
    if (!newTodoText.trim()) return;
    try {
      await apiClient.post('/todos', {
        text: newTodoText,
        priority: newTodoPriority,
        category: newTodoCategory,
        dueDate: newTodoDueDate?.toISOString()
      });
      toast.success("Todo added!");
      refetch(); // Recargamos la lista
      setNewTodoText(""); setNewTodoPriority("medium"); setNewTodoCategory("Personal"); setNewTodoDueDate(undefined);
      setIsAdding(false);
    } catch (err) {
      toast.error((err as Error).message);
    }
  }

  const toggleTodo = async (id: string, completed: boolean) => {
    try {
        await apiClient.put(`/todos/${id}`, { completed });
        toast.success(`Task ${completed ? 'completed' : 'reopened'}!`);
        refetch();
    } catch (err) {
        toast.error((err as Error).message);
    }
  }

  const deleteTodo = async (id: string) => {
     if (!window.confirm("Are you sure you want to delete this todo?")) return;
     try {
        await apiClient.del(`/todos/${id}`);
        toast.success("Todo deleted.");
        refetch();
     } catch (err) {
        toast.error((err as Error).message);
     }
  }

  const filteredTodos = React.useMemo(() => {
    return todos?.filter((todo) => {
        if (!showCompleted && todo.completed) return false
        if (filterCategory !== "All" && todo.category !== filterCategory) return false
        if (filterPriority !== "All" && todo.priority !== filterPriority.toLowerCase()) return false
        return true
      }) || [];
  }, [todos, showCompleted, filterCategory, filterPriority]);

  const completedCount = todos?.filter((todo) => todo.completed).length || 0;
  const totalCount = todos?.length || 0;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  
  const getPriorityColor = (priority: string) => { /* ... */ };

  return (
    <AppLayout>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {/* ... (Header y barra de progreso se mantienen igual) ... */}
        {/* ... (Formulario para añadir Todos se mantiene igual, pero ahora llama a `addTodo`) ... */}
        {isLoading ? (
            <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-2xl" />)}
            </div>
        ) : error ? (
            <div className="text-center text-destructive"><AlertTriangle className="mx-auto mb-2" /> {error}</div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {filteredTodos.map((todo) => (
                <motion.div key={todo.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -100 }} className="glass-card p-4 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <Checkbox checked={todo.completed} onCheckedChange={(checked) => toggleTodo(todo.id, !!checked)} />
                    {/* ... (Resto del renderizado del todo se mantiene igual, usando deleteTodo) ... */}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </AppLayout>
  )
}

