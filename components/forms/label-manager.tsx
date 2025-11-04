// Jello-Frontend/components/forms/label-manager.tsx

"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, LoaderCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label as LabelType } from "@/types"
import { apiClient } from "@/lib/api"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"

const COLORS = ["#ef4444", "#f97316", "#eab308", "#84cc16", "#22c55e", "#14b8a6", "#06b6d4", "#3b82f6", "#8b5cf6", "#d946ef", "#ec4899"];
const getRandomColor = () => COLORS[Math.floor(Math.random() * COLORS.length)];

// --- INICIO DE LA CORRECCIÓN: Props modificadas para un componente controlado ---
interface LabelManagerProps {
  labels: LabelType[];
  onLabelAdd: (name: string) => void;
  onLabelDelete: (id: string) => void;
  isSubmitting: boolean;
}

export function LabelManager({ labels, onLabelAdd, onLabelDelete, isSubmitting }: LabelManagerProps) {
  const [newLabelName, setNewLabelName] = React.useState("");

  const handleCreateLabel = () => {
    if (!newLabelName.trim() || isSubmitting) return;
    onLabelAdd(newLabelName.trim()); // Llama a la función del padre
    setNewLabelName("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleCreateLabel();
    }
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <Input
          placeholder="Add a new label and press Enter"
          value={newLabelName}
          onChange={(e) => setNewLabelName(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isSubmitting}
          className="pr-8"
        />
        {isSubmitting && <LoaderCircle className="w-4 h-4 animate-spin absolute right-2 top-1/2 -translate-y-1/2" />}
      </div>
      <div className="flex flex-wrap gap-2 min-h-[20px]">
        <AnimatePresence>
          {labels.map(label => (
            <motion.div key={label._id} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}>
              <Badge variant="secondary" className="text-sm py-1 px-3" style={{ backgroundColor: label.color + '20', color: label.color }}>
                {label.name}
                <button 
                  onClick={() => onLabelDelete(label._id)} 
                  className="..." 
                  disabled={isSubmitting}
                  type="button" // <--- AÑADIR ESTA LÍNEA
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}