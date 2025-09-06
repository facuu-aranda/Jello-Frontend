"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AppLayout } from "@/components/layout/app-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select } from "@/components/ui/select"
import { Icon } from "@/components/ui/icon"

interface Todo {
  id: string
  text: string
  completed: boolean
  priority: "low" | "medium" | "high"
  category: string
  dueDate?: string
  createdAt: string
}

const mockTodos: Todo[] = [
  {
    id: "1",
    text: "Review quarterly budget reports",
    completed: false,
    priority: "high",
    category: "Work",
    dueDate: "2024-01-15",
    createdAt: "2024-01-10",
  },
  {
    id: "2",
    text: "Schedule dentist appointment",
    completed: false,
    priority: "medium",
    category: "Personal",
    createdAt: "2024-01-09",
  },
  {
    id: "3",
    text: "Update portfolio website",
    completed: true,
    priority: "low",
    category: "Projects",
    createdAt: "2024-01-08",
  },
  {
    id: "4",
    text: "Plan weekend trip",
    completed: false,
    priority: "low",
    category: "Personal",
    dueDate: "2024-01-20",
    createdAt: "2024-01-07",
  },
]

const categories = ["All", "Work", "Personal", "Projects", "Health"]
const priorities = ["All", "High", "Medium", "Low"]

export default function PersonalTodosPage() {
  const [todos, setTodos] = useState<Todo[]>(mockTodos)
  const [newTodo, setNewTodo] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedPriority, setSelectedPriority] = useState("All")
  const [showCompleted, setShowCompleted] = useState(true)

  const addTodo = () => {
    if (!newTodo.trim()) return

    const todo: Todo = {
      id: Date.now().toString(),
      text: newTodo,
      completed: false,
      priority: "medium",
      category: "Personal",
      createdAt: new Date().toISOString(),
    }

    setTodos([todo, ...todos])
    setNewTodo("")
  }

  const toggleTodo = (id: string) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  const filteredTodos = todos.filter((todo) => {
    if (!showCompleted && todo.completed) return false
    if (selectedCategory !== "All" && todo.category !== selectedCategory) return false
    if (selectedPriority !== "All" && todo.priority !== selectedPriority.toLowerCase()) return false
    return true
  })

  const completedCount = todos.filter((todo) => todo.completed).length
  const totalCount = todos.length
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <AppLayout>
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-jello-blue to-jello-blue-dark flex items-center justify-center">
              <Icon name="check-square" className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Personal Todos</h1>
              <p className="text-gray-600 dark:text-gray-400">Manage your personal tasks and goals</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="glass-card p-4 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Progress: {completedCount} of {totalCount} completed
              </span>
              <span className="text-sm text-gray-500">{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-jello-blue to-jello-blue-dark h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>

        {/* Add Todo */}
        <div className="glass-card p-6 rounded-2xl mb-6">
          <div className="flex gap-3">
            <Input
              placeholder="Add a new todo..."
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addTodo()}
              className="flex-1"
            />
            <Button onClick={addTodo} className="px-6">
              <Icon name="plus" className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="glass-card p-4 rounded-2xl mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Category:</span>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
                options={categories.map((cat) => ({ value: cat, label: cat }))}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Priority:</span>
              <Select
                value={selectedPriority}
                onValueChange={setSelectedPriority}
                options={priorities.map((pri) => ({ value: pri, label: pri }))}
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox checked={showCompleted} onCheckedChange={setShowCompleted} />
              <span className="text-sm text-gray-700 dark:text-gray-300">Show completed</span>
            </div>
          </div>
        </div>

        {/* Todos List */}
        <div className="space-y-3">
          <AnimatePresence>
            {filteredTodos.map((todo) => (
              <motion.div
                key={todo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="glass-card p-4 rounded-2xl hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  <Checkbox checked={todo.completed} onCheckedChange={() => toggleTodo(todo.id)} />

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-base ${todo.completed ? "line-through text-gray-500" : "text-gray-900 dark:text-white"}`}
                      >
                        {todo.text}
                      </span>
                      <div className={`w-2 h-2 rounded-full ${getPriorityColor(todo.priority)}`} />
                    </div>

                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <Badge variant="secondary" className="text-xs">
                        {todo.category}
                      </Badge>
                      <Badge variant="outline" className="text-xs capitalize">
                        {todo.priority}
                      </Badge>
                      {todo.dueDate && (
                        <span className="flex items-center gap-1">
                          <Icon name="calendar" className="w-3 h-3" />
                          {new Date(todo.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteTodo(todo.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Icon name="trash-2" className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredTodos.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <Icon name="check-circle" className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No todos found</h3>
              <p className="text-gray-500">
                {todos.length === 0 ? "Add your first todo to get started!" : "Try adjusting your filters."}
              </p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
