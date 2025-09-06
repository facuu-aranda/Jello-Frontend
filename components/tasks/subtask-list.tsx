"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

interface Subtask {
  id: string
  text: string
  completed: boolean
}

interface SubtaskListProps {
  subtasks: Subtask[]
  onSubtaskToggle?: (id: string) => void
  onSubtaskAdd?: (text: string) => void
  onSubtaskDelete?: (id: string) => void
}

export function SubtaskList({ subtasks, onSubtaskToggle, onSubtaskAdd, onSubtaskDelete }: SubtaskListProps) {
  const [newSubtask, setNewSubtask] = React.useState("")
  const [isAdding, setIsAdding] = React.useState(false)

  const handleAdd = () => {
    if (newSubtask.trim()) {
      onSubtaskAdd?.(newSubtask.trim())
      setNewSubtask("")
      setIsAdding(false)
    }
  }

  const completedCount = subtasks.filter((subtask) => subtask.completed).length

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h4 className="font-medium text-foreground">Subtasks</h4>
          <p className="text-sm text-muted-foreground">
            {completedCount} of {subtasks.length} completed
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setIsAdding(true)}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Progress Bar */}
      {subtasks.length > 0 && (
        <div className="w-full bg-muted rounded-full h-2">
          <motion.div
            className="h-2 bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(completedCount / subtasks.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      )}

      {/* Subtasks List */}
      <div className="space-y-2">
        {subtasks.map((subtask, index) => (
          <motion.div
            key={subtask.id}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Checkbox checked={subtask.completed} onCheckedChange={() => onSubtaskToggle?.(subtask.id)} />
            <span
              className={`flex-1 text-sm ${
                subtask.completed ? "line-through text-muted-foreground" : "text-foreground"
              }`}
            >
              {subtask.text}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => onSubtaskDelete?.(subtask.id)}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </motion.div>
        ))}

        {/* Add New Subtask */}
        {isAdding && (
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Input
              placeholder="Add a subtask..."
              value={newSubtask}
              onChange={(e) => setNewSubtask(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAdd()
                if (e.key === "Escape") setIsAdding(false)
              }}
              className="flex-1"
              autoFocus
            />
            <Button size="sm" onClick={handleAdd}>
              Add
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
