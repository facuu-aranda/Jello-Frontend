"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription } from "@/components/ui/modal"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/contexts/AuthContext"
import { api } from "@/lib/api/client"

const predefinedText = "Hello! I'm very interested in collaborating on this project. I believe my skills would be a great asset. Looking forward to hearing from you."

interface CollaborateModalProps {
  isOpen: boolean
  onClose: () => void
  projectId: string
  projectName: string
}

export function CollaborateModal({ isOpen, onClose, projectId, projectName }: CollaborateModalProps) {
  const { token } = useAuth();
  const [message, setMessage] = React.useState(predefinedText);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await api.post(`/projects/${projectId}/join-requests`, { message }, token);
      // Opcional: mostrar toast de éxito
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to send request.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleClose = () => {
    setMessage(predefinedText);
    setError(null);
    setIsLoading(false);
    onClose();
  }

  return (
    <Modal open={isOpen} onOpenChange={handleClose}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Request to Collaborate</ModalTitle>
          <ModalDescription>Send a message to the owner of "{projectName}".</ModalDescription>
        </ModalHeader>
        <div className="p-6 space-y-4">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[120px]"
            disabled={isLoading}
          />
          {error && <p className="text-sm text-destructive text-center">{error}</p>}
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={handleClose} disabled={isLoading}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Request"}
            </Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  )
}