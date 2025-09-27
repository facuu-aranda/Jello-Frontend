"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UserPlus, Handshake } from "lucide-react"
import { InviteUserModal } from "@/components/modals/InviteUserModal"
import { CollaborateModal } from "@/components/modals/CollaborateModal"
import { SearchResult } from "@/types" // Importa el tipo centralizado
import { DetailModal } from "@/components/modals/DetailModal"
interface SearchResultCardProps {
  result: SearchResult
}

export function SearchResultCard({ result }: SearchResultCardProps) {
  const [isInviteModalOpen, setInviteModalOpen] = React.useState(false)
  const [isCollaborateModalOpen, setCollaborateModalOpen] = React.useState(false)
  const [isDetailModalOpen, setDetailModalOpen] = React.useState(false)

  const handleActionClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  }

  return (
    <>
      <motion.div
        className="glass-card p-6 flex flex-col h-full cursor-pointer"
        whileHover={{ scale: 1.04, transition: { type: "spring" }}}
        whileTap={{ scale: 0.96 }}
        onClick={() => setDetailModalOpen(true)}
      >
        {/* El flex-grow empuja el pie de la tarjeta hacia abajo */}
        <div className="flex-grow">
          <div className="flex items-start gap-4">
            <Avatar className="w-12 h-12 rounded-lg">
              <AvatarImage src={result.avatar ?? undefined} />
              <AvatarFallback className="rounded-lg">{result.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-foreground">{result.name}</h3>
                <Badge variant={result.type === 'user' ? 'secondary' : 'default'}>
                  {result.type}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">{result.description}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-border/50">
          {result.type === 'user' && (
            <Button size="sm" onClick={(e) => handleActionClick(e, () => setInviteModalOpen(true))}>
              <UserPlus className="w-4 h-4 mr-2" />
              Enviar invitación
            </Button>
          )}
          {result.type === 'project' && (
            <Button size="sm" onClick={(e) => handleActionClick(e, () => setCollaborateModalOpen(true))}>
              <Handshake className="w-4 h-4 mr-2" />
              Quiero colaborar
            </Button>
          )}
        </div>
      </motion.div>

      {/* Modales que se abren desde esta tarjeta */}
      <DetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        result={result}
        onInvite={() => setInviteModalOpen(true)}
        onCollaborate={() => setCollaborateModalOpen(true)}
      />
      {result.type === 'user' && (
       <InviteUserModal 
  isOpen={isInviteModalOpen} 
  onClose={() => setInviteModalOpen(false)} 
  user={{
    id: result.id,
    name: result.name,
    avatarUrl: result.avatar // Mapeamos 'avatar' a 'avatarUrl'
  }} 
/>
      )}
      {result.type === 'project' && (
        <CollaborateModal isOpen={isCollaborateModalOpen} onClose={() => setCollaborateModalOpen(false)} projectName={result.name} />
      )}
    </>
  )
}