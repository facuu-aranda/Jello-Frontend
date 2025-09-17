"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription } from "@/components/ui/modal"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

// Mock de proyectos del usuario para el selector
const userProjects = [
  { id: "1", name: "Website Redesign" },
  { id: "4", name: "Backend API" },
]

interface InviteUserModalProps {
  isOpen: boolean
  onClose: () => void
  user: { name: string; avatar?: string }
}

export function InviteUserModal({ isOpen, onClose, user }: InviteUserModalProps) {
  const [selectedProject, setSelectedProject] = React.useState("")

  const handleInvite = () => {
    if (!selectedProject) return;
    console.log(`Inviting ${user.name} to project ID ${selectedProject}`);
    onClose();
  }

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent>
        <ModalHeader>
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <ModalTitle>Invite {user.name} to a project</ModalTitle>
              <ModalDescription>Select a project to send the invitation.</ModalDescription>
            </div>
          </div>
        </ModalHeader>
        <div className="p-6 space-y-4">
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a project..." />
            </SelectTrigger>
            <SelectContent>
              {userProjects.map((project) => (
                <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button onClick={handleInvite} disabled={!selectedProject}>Send Invitation</Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  )
}