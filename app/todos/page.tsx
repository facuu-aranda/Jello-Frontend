"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AppLayout } from "@/components/layout/app-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Trash2, Plus, CheckSquare, AlertTriangle } from "lucide-react"
import { DatePicker } from "@/components/ui/date-picker"
import { useApi } from "@/hooks/useApi"
import { apiClient } from "@/lib/api"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import { Todo } from "@/types"

const categories = ["All", "Work", "Personal", "Projects", "Health"]
const priorities = [
  { value: "All", label: "All" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" }
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
      refetch();
      setNewTodoText(""); 
      setNewTodoPriority("medium"); 
      setNewTodoCategory("Personal"); 
      setNewTodoDueDate(undefined);
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

  const filteredTodos = useMemo(() => {
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
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <AppLayout>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
              <CheckSquare className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Personal Todos</h1>
              <p className="text-muted-foreground">Manage your personal tasks and goals</p>
            </div>
          </div>
          <div className="glass-card p-4 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Progress: {completedCount} of {totalCount} completed</span>
              <span className="text-sm text-muted-foreground">{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">Category:</span>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
                  <SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">Priority:</span>
                <Select value={filterPriority} onValueChange={setFilterPriority}>
                  <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
                  <SelectContent>{priorities.map(p => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="show-completed" checked={showCompleted} onCheckedChange={(checked) => setShowCompleted(Boolean(checked))} />
                <Label htmlFor="show-completed" className="text-sm">Show completed</Label>
              </div>
              <div className="flex-grow flex justify-end">
              <Button variant={isManaging ? "destructive" : "outline"} onClick={() => setIsManaging(!isManaging)}>
                  {isManaging ? "Done" : "Manage"}
                </Button>
              </div>
            </div>
        </div>

        <div className="glass-card p-4 rounded-2xl">
          <AnimatePresence mode="wait">
            {isAdding ? (
              <motion.div key="form" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }} className="overflow-hidden">
                <div className="space-y-4 p-2">
                  <Input placeholder="What do you need to do?" value={newTodoText} onChange={(e) => setNewTodoText(e.target.value)} className="text-lg h-12" autoFocus />
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Priority</Label>
                      <Select value={newTodoPriority} onValueChange={(v: "low" | "medium" | "high") => setNewTodoPriority(v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>{priorities.filter(p => p.value !== 'All').map(p => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select value={newTodoCategory} onValueChange={(v: string) => setNewTodoCategory(v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>{categories.filter(c => c !== 'All').map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Due Date</Label>
                      <DatePicker date={newTodoDueDate} onDateChange={setNewTodoDueDate} />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button variant="ghost" onClick={() => setIsAdding(false)}>Cancel</Button>
                    <Button onClick={addTodo}>Add Task</Button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div key="button" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Button className="w-full h-12" variant="ghost" onClick={() => setIsAdding(true)}><Plus className="w-4 h-4 mr-2" />Add a new todo</Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

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
                    <div className="flex-1">
                      <p className={`text-base ${todo.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>{todo.text}</p>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                        <Badge variant="secondary">{todo.category}</Badge>
                        <div className="flex items-center gap-1.5">
                          <div className={`w-2 h-2 rounded-full ${getPriorityColor(todo.priority)}`} />
                          <span className="capitalize">{todo.priority}</span>
                        </div>
                        {todo.dueDate && (<span>Due: {new Date(todo.dueDate).toLocaleDateString()}</span>)}
                      </div>
                    </div>
                    <AnimatePresence>
                      {isManaging && (
                        <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}>
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => deleteTodo(todo.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
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