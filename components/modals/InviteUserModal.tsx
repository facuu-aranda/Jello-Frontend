"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription } from "@/components/ui/modal"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/AuthContext"
import { api } from "@/lib/api/client"
import { Project } from "@/lib/api/types"
import { SearchResult } from "@/lib/api/types" 

interface InviteUserModalProps {
  isOpen: boolean
  onClose: () => void
  user: SearchResult // Usamos el tipo compartido
}

export function InviteUserModal({ isOpen, onClose, user }: InviteUserModalProps) {
  const { token } = useAuth();
  const [ownedProjects, setOwnedProjects] = React.useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchOwnedProjects = async () => {
      if (isOpen && token) {
        try {
          const projects = await api.get('/projects/owned', token);
          setOwnedProjects(projects);
        } catch (err) {
          console.error("Failed to fetch owned projects", err);
        }
      }
    };
    fetchOwnedProjects();
  }, [isOpen, token]);

  const handleInvite = async () => {
    if (!selectedProject || !user.email) return;
    setIsLoading(true);
    setError(null);
    try {
      await api.post(`/projects/${selectedProject}/members`, { email: user.email }, token);
      // Opcional: mostrar un toast de éxito
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to send invitation.");
    } finally {
      setIsLoading(false);
    }
  };

  // Limpiar estado al cerrar
  const handleClose = () => {
    setSelectedProject("");
    setError(null);
    setIsLoading(false);
    onClose();
  }

  return (
    <Modal open={isOpen} onOpenChange={handleClose}>
      <ModalContent>
        <ModalHeader>
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <ModalTitle>Invite {user.name} to a project</ModalTitle>
              <ModalDescription>Select one of your projects to send the invitation.</ModalDescription>
            </div>
          </div>
        </ModalHeader>
        <div className="p-6 space-y-4">
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a project..." />
            </SelectTrigger>
            <SelectContent>
              {ownedProjects.length > 0 ? (
                ownedProjects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>
                ))
              ) : (
                <div className="p-4 text-sm text-muted-foreground">You don't own any projects.</div>
              )}
            </SelectContent>
          </Select>
          {error && <p className="text-sm text-destructive text-center">{error}</p>}
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={handleClose} disabled={isLoading}>Cancel</Button>
            <Button onClick={handleInvite} disabled={!selectedProject || isLoading}>
              {isLoading ? "Sending..." : "Send Invitation"}
            </Button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  )
}