"use client"
import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
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
  subtasks: Subtask[];
  isEditing: boolean;
  onSubtaskToggle: (id: string) => void;
  onSubtaskAdd: (text: string) => void;
  onSubtaskDelete: (id: string) => void;
}

export function SubtaskList({ subtasks, isEditing, onSubtaskToggle, onSubtaskAdd, onSubtaskDelete }: SubtaskListProps) {
  const [newSubtask, setNewSubtask] = React.useState("")
  const [isAdding, setIsAdding] = React.useState(false)

  const handleAdd = () => {
    if (newSubtask.trim()) {
      onSubtaskAdd(newSubtask.trim())
      setNewSubtask("")
      setIsAdding(false)
    }
  }

  const subtaskList = Array.isArray(subtasks) ? subtasks : [];
  const completedCount = subtaskList.filter((subtask) => subtask.completed).length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h4 className="font-medium text-foreground">Subtasks</h4>
          <p className="text-sm text-muted-foreground">
            {completedCount} of {subtaskList.length} completed
          </p>
        </div>
        {isEditing && (
          <Button variant="ghost" size="sm" onClick={() => setIsAdding(true)}>
            <Plus className="w-4 h-4" />
          </Button>
        )}
      </div>

      {subtaskList.length > 0 && (
        <div className="w-full bg-muted rounded-full h-2">
          <motion.div
            className="h-2 bg-primary rounded-full"
            animate={{ width: `${(completedCount / subtaskList.length) * 100}%` }}
          />
        </div>
      )}

      <div className="space-y-2">
        <AnimatePresence>
          {subtaskList.map((subtask) => (
            <motion.div
              key={subtask.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors group"
            >
              <Checkbox id={`subtask-${subtask.id}`} checked={subtask.completed} onCheckedChange={() => onSubtaskToggle(subtask.id)} disabled={!isEditing} />
              <label htmlFor={`subtask-${subtask.id}`} className={`flex-1 text-sm ${subtask.completed ? "line-through text-muted-foreground" : "text-foreground"} ${isEditing ? 'cursor-pointer' : ''}`}>
                {subtask.text}
              </label>
              {isEditing && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
                  onClick={() => onSubtaskDelete(subtask.id)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isEditing && isAdding && (
          <motion.div className="flex items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Input placeholder="Add a subtask..." value={newSubtask} onChange={(e) => setNewSubtask(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") handleAdd() }} className="flex-1" autoFocus />
            <Button size="sm" onClick={handleAdd}>Add</Button>
          </motion.div>
        )}
      </div>
    </div>
  )
}