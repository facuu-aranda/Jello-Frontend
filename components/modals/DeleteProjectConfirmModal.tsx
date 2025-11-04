"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface DeleteProjectConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmDelete: () => void;
  projectName: string;
}

/**
 * Genera una cadena alfanumérica aleatoria de 8 caracteres.
 */
const generateRandomString = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export function DeleteProjectConfirmModal({ isOpen, onClose, onConfirmDelete, projectName }: DeleteProjectConfirmModalProps) {
  const [confirmationString, setConfirmationString] = React.useState("");
  const [userInput, setUserInput] = React.useState("");

  // Regenera el código y limpia el input cada vez que el modal se abre
  React.useEffect(() => {
    if (isOpen) {
      setConfirmationString(generateRandomString());
      setUserInput("");
    }
  }, [isOpen]);

  /**
   * Bloquea el evento 'pegar' (paste) en el input.
   */
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    toast.warning("Para confirmar, debes escribir el código manualmente.");
  };

  /**
   * Bloquea el evento 'copiar' (copy) en el texto de confirmación.
   */
  const handleCopy = (e: React.ClipboardEvent) => {
    e.preventDefault();
    toast.error("No se puede copiar el texto de confirmación.");
  };

  // El botón de eliminar solo se activa si el texto coincide exactamente.
  const isMatch = userInput === confirmationString;

  return (
    // Usamos 'Dialog' como en DeleteTaskAlert para que funcione sobre el modal de edición
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* onPointerDownOutside previene que se cierre el modal de edición 
        que está por debajo al hacer clic fuera.
      */}
      <DialogContent onPointerDownOutside={(e: any) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>¿Estás absolutamente seguro?</DialogTitle>
          <DialogDescription>
            Esta acción no se puede deshacer. Esto eliminará permanentemente el proyecto <strong>{projectName}</strong>,
            junto con todas sus tareas, etiquetas, comentarios y adjuntos.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 my-4">
          <p className="text-sm text-foreground">
            Para confirmar, por favor escribe la siguiente cadena de texto (se distinguen mayúsculas y minúsculas):
          </p>
          
          {/* Este bloque previene que el usuario seleccione y copie el texto.
          */}
          <div 
            className="w-full text-center bg-muted/80 text-foreground font-mono text-lg py-3 rounded-md"
            style={{ userSelect: 'none' }} // Previene la selección de texto
            onCopy={handleCopy} // Previene la copia por teclado
          >
            {confirmationString}
          </div>

          <Input 
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onPaste={handlePaste} // Previene el pegado
            placeholder="Escribe la cadena para confirmar..."
            className={cn(
              "font-mono text-center text-base",
              // Añade feedback visual si el usuario está escribiendo
              userInput && (isMatch ? "border-green-500 focus-visible:ring-green-500" : "border-destructive focus-visible:ring-destructive")
            )}
            aria-label="Confirmation input"
          />
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            disabled={!isMatch}
            onClick={onConfirmDelete}
          >
            Sí, entiendo y quiero eliminar este proyecto
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}