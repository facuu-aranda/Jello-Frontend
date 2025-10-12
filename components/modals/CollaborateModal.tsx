// components/modals/CollaborateModal.tsx

"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription } from "@/components/ui/modal"
import { Textarea } from "@/components/ui/textarea"
// --- NUEVO: Imports necesarios ---
import { apiClient } from "@/lib/api"
import { toast } from "sonner"


const predefinedText = "Hello! I'm very interested in collaborating on this project. I believe my skills in [mention your skills] would be a great asset. Looking forward to hearing from you."

// --- MODIFICADO: Se añade projectId a las props ---
interface CollaborateModalProps {
  isOpen: boolean
  onClose: () => void
  projectName: string
  projectId: string
}

export function CollaborateModal({ isOpen, onClose, projectName, projectId }: CollaborateModalProps) {
  const [message, setMessage] = React.useState(predefinedText)

  // --- MODIFICADO: La función ahora llama a la API ---
  const handleSubmit = async () => {
    toast.info("Sending collaboration request...");
    try {
      // Asumimos un endpoint lógico para crear la notificación de solicitud
      await apiClient.post('/notifications/collaborate', { projectId, message });
      toast.success("Request sent successfully!");
      onClose()
    } catch (error) {
      toast.error((error as Error).message);
    }
  }

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Request to Collaborate</ModalTitle>
          <ModalDescription>Send a message to the project owner of "{projectName}".</ModalDescription>
        </ModalHeader>
        <div className="p-6 space-y-4">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[120px]"
          />
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSubmit}>Send Request</Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  )
}