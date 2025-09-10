"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Plus, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

const initialTodos = [
  { id: 1, text: "Review quarterly goals", completed: false },
  { id: 2, text: "Schedule dentist appointment", completed: true },
  { id: 3, text: "Buy groceries for the week", completed: false },
  { id: 4, text: "Call mom", completed: false },
]

export function PersonalTodoWidget() {
  const [todos, setTodos] = React.useState(initialTodos)
  const [newTodo, setNewTodo] = React.useState("")
  const [isAdding, setIsAdding] = React.useState(false)

  const toggleTodo = (id: number) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, { id: Date.now(), text: newTodo.trim(), completed: false }])
      setNewTodo("")
      setIsAdding(false)
    }
  }

  const completedCount = todos.filter((todo) => todo.completed).length

  return (
    <motion.div
      className="glass-card p-6 space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-foreground">Personal Todo</h3>
          <p className="text-sm text-muted-foreground">
            {completedCount} of {todos.length} completed
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setIsAdding(true)}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="w-full bg-muted rounded-full h-2">
          <motion.div
            className="h-2 bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(completedCount / todos.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Todo List */}
      <div className="space-y-3">
        {todos.map((todo, index) => (
          <motion.div
            key={todo.id}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Checkbox checked={todo.completed} onCheckedChange={() => toggleTodo(todo.id)} />
            <span
              className={`flex-1 text-sm ${todo.completed ? "line-through text-muted-foreground" : "text-foreground"}`}
            >
              {todo.text}
            </span>
          </motion.div>
        ))}

        {/* Add New Todo */}
        {isAdding && (
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Input
              placeholder="Add a new todo..."
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") addTodo()
                if (e.key === "Escape") setIsAdding(false)
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

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
        <Button variant="outline" size="sm" className="flex-1 bg-transparent">
          View All
        </Button>
        <Button variant="outline" size="sm" className="flex-1 bg-transparent">
          Manage
        </Button>
      </div>
    </motion.div>
  )
}
