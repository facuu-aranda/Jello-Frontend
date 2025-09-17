"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription } from "@/components/ui/modal"
import { Textarea } from "@/components/ui/textarea"

const predefinedText = "Hello! I'm very interested in collaborating on this project. I believe my skills in [mention your skills] would be a great asset. Looking forward to hearing from you."

interface CollaborateModalProps {
  isOpen: boolean
  onClose: () => void
  projectName: string
}

export function CollaborateModal({ isOpen, onClose, projectName }: CollaborateModalProps) {
  const [message, setMessage] = React.useState(predefinedText)

  const handleSubmit = () => {
    console.log(`Request to collaborate on ${projectName} with message: ${message}`)
    onClose()
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