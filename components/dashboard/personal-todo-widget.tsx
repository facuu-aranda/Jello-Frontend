"use client"
import * as React from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Check, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
// --- NUEVO: Imports necesarios ---
import { useApi } from "@/hooks/useApi"
import { Todo } from "@/types"
import { apiClient } from "@/lib/api"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"

export function PersonalTodoWidget() {
  // --- MODIFICADO: Usamos useApi para obtener los todos ---
  const { data: todos, isLoading, refetch } = useApi<Todo[]>('/todos');

  // --- Mantenemos estados locales solo para la UI ---
  const [newTodoText, setNewTodoText] = React.useState("")
  const [isAdding, setIsAdding] = React.useState(false)

  // --- MODIFICADO: Funciones que llaman a la API ---
  const toggleTodo = async (id: string, completed: boolean) => {
    try {
        await apiClient.put(`/todos/${id}`, { completed });
        toast.success(`Task ${completed ? 'completed' : 'reopened'}!`);
        refetch(); // Recargamos la lista
    } catch (err) {
        toast.error((err as Error).message);
    }
  }

  const addTodo = async () => {
    if (!newTodoText.trim()) return;
    try {
      await apiClient.post('/todos', { text: newTodoText });
      toast.success("Todo added!");
      refetch(); // Recargamos la lista
      setNewTodoText("");
      setIsAdding(false);
    } catch (err) {
      toast.error((err as Error).message);
    }
  }

  const deleteTodo = async (id: string) => {
     if (!window.confirm("Are you sure?")) return;
     try {
        await apiClient.del(`/todos/${id}`);
        toast.success("Todo deleted.");
        refetch(); // Recargamos la lista
     } catch (err) {
        toast.error((err as Error).message);
     }
  }
  
  // --- MODIFICADO: Cálculos basados en datos de la API ---
  const completedCount = todos?.filter((todo) => todo.completed).length || 0;
  const totalCount = todos?.length || 0;

  return (
    <motion.div
      className="glass-card p-6 space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-foreground">Personal Todo</h3>
          <p className="text-sm text-muted-foreground">
            {completedCount} of {totalCount} completed
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setIsAdding(!isAdding)}>
           <Plus className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-2">
        <div className="w-full bg-muted rounded-full h-2">
          <motion.div
            className="h-2 bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
        <AnimatePresence>
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} className="h-8 w-full rounded-lg" />)
          ) : (
            todos?.map((todo) => (
              <motion.div
                key={todo.id}
                layout
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-3 p-2 rounded-lg group"
              >
                <Checkbox 
                  checked={todo.completed} 
                  onCheckedChange={(checked) => toggleTodo(todo.id, !!checked)} 
                />
                <span className={`flex-1 text-sm ${todo.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                  {todo.text}
                </span>
                <Button 
                  variant="ghost" size="icon" 
                  className="w-6 h-6 text-destructive opacity-0 group-hover:opacity-100 transition-opacity" 
                  onClick={() => deleteTodo(todo.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </motion.div>
            ))
          )}
        </AnimatePresence>

        {isAdding && (
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Input
              placeholder="Add a new todo..."
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") addTodo();
                if (e.key === "Escape") setIsAdding(false);
              }}
              className="flex-1"
              autoFocus
            />
            <Button size="sm" onClick={addTodo}>
              <Check className="w-4 h-4" />
            </Button>
          </motion.div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
        <Button asChild variant="outline" size="sm" className="flex-1 bg-transparent">
          <Link href="/todos">View All</Link>
        </Button>
      </div>
    </motion.div>
  )
}