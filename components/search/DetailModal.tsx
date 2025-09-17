"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Modal, ModalContent } from "@/components/ui/modal"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { UserPlus, Handshake } from "lucide-react"
import { SkillsEditor } from "@/components/profile/SkillsEditor"

// Definimos un tipo que pueda ser usado por varios componentes
export type SearchResult = {
  type: 'user' | 'project'
  id: string
  name: string
  description: string
  avatar?: string
  banner?: string
  skills?: string[] // Habilidades para los usuarios
}

interface DetailModalProps {
  isOpen: boolean
  onClose: () => void
  result: SearchResult | null
  onInvite: () => void
  onCollaborate: () => void
}

export function DetailModal({ isOpen, onClose, result, onInvite, onCollaborate }: DetailModalProps) {
  if (!result) return null

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent className="w-[95vw] max-w-2xl max-h-[90vh] flex flex-col p-0 glass-card">
        <div className="flex-shrink-0 relative">
          <img src={result.banner || "/placeholder.jpg"} alt={`${result.name} banner`} className="w-full h-32 object-cover rounded-t-2xl" />
          <div className="absolute -bottom-10 left-6">
            <Avatar className="w-20 h-20 rounded-lg border-4 border-background">
              <AvatarImage src={result.avatar} />
              <AvatarFallback className="rounded-lg text-2xl">{result.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="pt-14 px-6 pb-6 space-y-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-foreground">{result.name}</h2>
                <Badge variant={result.type === 'user' ? 'secondary' : 'default'}>{result.type}</Badge>
              </div>
              <p className="text-muted-foreground">{result.description}</p>
            </div>

            {result.type === 'user' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Skills</h3>
                <SkillsEditor selectedSkills={result.skills || []} setSelectedSkills={() => { }} isEditing={false} />
              </div>
            )}
          </div>
        </div>

        <div className="flex-shrink-0 flex justify-end gap-3 p-4 border-t border-border/50">
          {result.type === 'user' && (<Button onClick={onInvite}><UserPlus className="w-4 h-4 mr-2" />Enviar invitación</Button>)}
          {result.type === 'project' && (<Button onClick={onCollaborate}><Handshake className="w-4 h-4 mr-2" />Quiero colaborar</Button>)}
        </div>
      </ModalContent>
    </Modal>
  )
}