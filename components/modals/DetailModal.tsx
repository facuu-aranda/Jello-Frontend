"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription } from "@/components/ui/modal"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { UserPlus, Handshake } from "lucide-react"
import { SearchResult } from "@/lib/api/types" 


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
      <ModalContent className="p-0 max-w-2xl">
        <div className="relative">
          <img src={result.banner || "/placeholder.jpg"} alt={`${result.name} banner`} className="w-full h-32 object-cover rounded-t-2xl" />
          <div className="absolute -bottom-10 left-6">
            <Avatar className="w-20 h-20 rounded-lg border-4 border-background">
              <AvatarImage src={result.avatar} />
              <AvatarFallback className="rounded-lg text-2xl">{result.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div className="p-6 pt-12">
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-2xl font-bold text-foreground">{result.name}</h2>
            <Badge variant={result.type === 'user' ? 'secondary' : 'default'}>
              {result.type}
            </Badge>
          </div>
          <p className="text-muted-foreground">{result.description}</p>
        </div>

        <div className="flex justify-end gap-3 p-6 pt-4 border-t border-border/50">
          {result.type === 'user' && (
            <Button onClick={onInvite}>
              <UserPlus className="w-4 h-4 mr-2" />
              Enviar invitación
            </Button>
          )}
          {result.type === 'project' && (
            <Button onClick={onCollaborate}>
              <Handshake className="w-4 h-4 mr-2" />
              Quiero colaborar
            </Button>
          )}
        </div>
      </ModalContent>
    </Modal>
  )
}