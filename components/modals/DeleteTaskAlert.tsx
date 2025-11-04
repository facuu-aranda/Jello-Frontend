// components/modals/DeleteTaskAlert.tsx

"use client"

import * as React from "react"
import { motion } from "framer-motion"

// --- INICIO DE LA CORRECCIÓN: Importamos 'Dialog' en lugar de 'AlertDialog' ---
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog" 
// --- FIN DE LA CORRECCIÓN ---

import { Button } from "@/components/ui/button"

interface DeleteTaskAlertProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmDelete: () => void;
}

export function DeleteTaskAlert({ isOpen, onClose, onConfirmDelete }: DeleteTaskAlertProps) {
  const [isDeleteEnabled, setIsDeleteEnabled] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setIsDeleteEnabled(false); 
      const timer = setTimeout(() => {
        setIsDeleteEnabled(true); 
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    // --- CORRECCIÓN: Usamos 'Dialog' ---
    <Dialog open={isOpen} onOpenChange={onClose}>
      
      {/* --- CORRECCIÓN: Usamos 'DialogContent' y añadimos la prop 'onPointerDownOutside' --- */}
      {/* Esto evita que el clic en la sombra cierre el modal de tarea de fondo. */}
      {/* Usamos 'e: any' para evitar los errores de tipo complejos de Radix. */}
      <DialogContent onPointerDownOutside={(e: any) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>¿Estás absolutamente seguro?</DialogTitle>
          <DialogDescription>
            Esta acción no se puede deshacer. Esto eliminará permanentemente la
            tarea, junto con todas sus subtareas, comentarios y adjuntos.
          </DialogDescription>
        </DialogHeader>
        
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden mt-2">
          {isOpen && (
            <motion.div
              className="h-full bg-destructive"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 5, ease: "linear" }}
            />
          )}
        </div>

        {/* --- CORRECCIÓN: Usamos 'DialogFooter' y 'Button' normales --- */}
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            disabled={!isDeleteEnabled}
            onClick={onConfirmDelete}
          >
            {isDeleteEnabled ? "Sí, eliminar tarea" : "Esperando..."}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}