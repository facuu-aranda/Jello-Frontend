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
  projectId: string;
  onDataChange: () => void;
}
// --- FIN DE LA CORRECCIÓN ---

export function LabelManager({ projectId, onDataChange }: LabelManagerProps) {
  const [labels, setLabels] = React.useState<LabelType[]>([]);
  const [newLabelName, setNewLabelName] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const fetchLabels = React.useCallback(() => {
    if (!projectId) return;
    setIsLoading(true);
    apiClient.get<LabelType[]>(`/projects/${projectId}/labels`)
      .then(setLabels)
      .catch(() => toast.error("Failed to load project labels."))
      .finally(() => setIsLoading(false));
  }, [projectId]);

  React.useEffect(() => {
    fetchLabels();
  }, [fetchLabels]);

  const handleCreateLabel = async () => {
    if (!newLabelName.trim() || isSubmitting) return;
    if (labels.some(l => l.name.toLowerCase() === newLabelName.trim().toLowerCase())) {
      toast.error("A label with that name already exists.");
      return;
    }

    setIsSubmitting(true);
    try {
      const newLabel = await apiClient.post<LabelType>(`/projects/${projectId}/labels`, {
        name: newLabelName.trim(),
        color: getRandomColor(),
      });
      // Actualización local inmediata
      setLabels(prev => [...prev, newLabel]);
      setNewLabelName("");
      toast.success(`Label "${newLabel.name}" created.`);
      onDataChange(); // Notifica al modal padre para que pueda refescar si es necesario
    } catch (error) {
      toast.error(`Failed to create label: ${(error as Error).message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteLabel = async (labelId: string) => {
    if (isSubmitting) return;

    const originalLabels = labels;
    // Actualización optimista
    setLabels(prev => prev.filter(l => l._id !== labelId));

    setIsSubmitting(true);
    try {
      await apiClient.del(`/labels/${labelId}`);
      toast.success("Label deleted.");
      onDataChange();
    } catch (error) {
      // Revertir en caso de error
      setLabels(originalLabels);
      toast.error(`Failed to delete label: ${(error as Error).message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleCreateLabel();
    }
  };

  if (isLoading) {
    return <p className="text-xs text-muted-foreground">Loading labels...</p>;
  }

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
                <button onClick={() => handleDeleteLabel(label._id)} className="ml-2 rounded-full hover:bg-destructive/20 p-0.5" disabled={isSubmitting}>
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