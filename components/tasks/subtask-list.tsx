"use client"
import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Subtask } from "@/types"

interface SubtaskListProps {
  subtasks: Subtask[];
  isEditing: boolean;
  onSubtaskToggle: (id: string, completed: boolean) => void;
  onSubtaskAdd: (text: string) => void;
  onSubtaskDelete: (id: string) => void;
}

export function SubtaskList({ subtasks, isEditing, onSubtaskToggle, onSubtaskAdd, onSubtaskDelete }: SubtaskListProps) {
  const [newSubtaskText, setNewSubtaskText] = React.useState("")

  const handleAdd = () => {
    if (newSubtaskText.trim()) {
      onSubtaskAdd(newSubtaskText.trim())
      setNewSubtaskText("")
    }
  }

  const completedCount = subtasks.filter((subtask) => subtask.completed).length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h4 className="font-medium text-foreground">Subtasks</h4>
          <p className="text-sm text-muted-foreground">
            {completedCount} of {subtasks.length} completed
          </p>
        </div>
        {isEditing && (
          <Button variant="ghost" size="sm" onClick={handleAdd}>
            <Plus className="w-4 h-4" />
          </Button>
        )}
      </div>

      {subtasks.length > 0 && (
        <div className="w-full bg-muted rounded-full h-2">
          <motion.div
            className="h-2 bg-primary rounded-full"
            animate={{ width: `${(completedCount / subtasks.length) * 100}%` }}
          />
        </div>
      )}

      <div className="space-y-2">
        <AnimatePresence>
          {subtasks.map((subtask) => (
            <motion.div
              key={subtask.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors group"
            >
              <Checkbox id={`subtask-${subtask.id}`} checked={subtask.completed} onCheckedChange={(checked) => onSubtaskToggle(subtask.id, Boolean(checked))} disabled={!isEditing} />
              <label htmlFor={`subtask-${subtask.id}`} className={`flex-1 text-sm ${subtask.completed ? "line-through text-muted-foreground" : "text-foreground"} ${isEditing ? 'cursor-pointer' : ''}`}>
                {subtask.text}
              </label>
             {isEditing && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-6 h-6 transition-opacity text-destructive"
                  onClick={() => onSubtaskDelete(subtask.id)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isEditing && (
          <motion.div className="flex items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Input placeholder="Add a subtask..." value={newSubtaskText} onChange={(e) => setNewSubtaskText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") handleAdd() }} className="flex-1" autoFocus />
            <Button size="sm" onClick={handleAdd}>Add</Button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
