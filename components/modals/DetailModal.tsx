"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Modal, ModalContent } from "@/components/ui/modal"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { UserPlus, Handshake } from "lucide-react"
// 1. Re-importamos SkillsEditor. ¡Esta es la forma correcta!
import { SkillsEditor } from "@/components/profile/SkillsEditor" 
import { SearchResult } from "@/types"

interface DetailModalProps {
  isOpen: boolean
  onClose: () => void
  result: SearchResult | null
  onInvite: () => void
  onCollaborate: () => void
}

export function DetailModal({ isOpen, onClose, result, onInvite, onCollaborate }: DetailModalProps) {
  if (!result) return null

  // 2. Lógica robusta para el banner (usa bannerUrl o bannerImageUrl)
  const bannerSrc = result.bannerUrl || (result as any).bannerImageUrl || null;

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent className="w-[95vw] max-w-2xl max-h-[90vh] flex flex-col p-0 glass-card">
        <div className="flex-shrink-0 relative">
          
          {/* --- BANNER Y FALLBACK --- */}
          <div className="w-full h-32 rounded-t-2xl overflow-hidden relative bg-blue-100 dark:bg-white">
            {/* Fallback de color */}
            {bannerSrc && ( 
              <img 
                src={bannerSrc} 
                alt={`${result.name} banner`} 
                className="w-full h-full object-cover absolute inset-0" 
              />
            )}
          </div>
          {/* --- FIN BANNER --- */}

          <div className="absolute -bottom-10 left-6">
            <Avatar className="w-20 h-20 rounded-lg border-4 border-background">
              <AvatarImage src={result.avatar ?? undefined} />
              <AvatarFallback className="rounded-lg text-2xl">{result.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto min-h-0 min-w-0">
          <div className="pt-14 px-6 pb-6 space-y-6 min-w-0">
            <div className="space-y-1 min-w-0">
      
              {/* --- TÍTULO (con truncate) --- */}
              <div className="flex items-center gap-2 min-w-0">
                <h2 className="flex-1 text-2xl font-bold text-foreground min-w-0 truncate">{result.name}</h2>
                <Badge variant={result.type === 'user' ? 'secondary' : 'default'}>{result.type}</Badge>
              </div>

              {/* --- DESCRIPCIÓN (con scroll y break-all) --- */}
              {result.description && (
                <p className="text-muted-foreground break-all max-h-32 overflow-y-auto rounded-md bg-muted/50 p-3">
                  {result.description}
                </p>
              )}
            </div>

            {/* --- SKILLS (Usando SkillsEditor) --- */}
            {/* 3. Esto funcionará tan pronto como la API envíe el array 'result.skills' */}
            {result.type === 'user' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Skills</h3>
                <SkillsEditor 
                  selectedSkills={result.skills || []} 
                  setSelectedSkills={() => { }} 
                  isEditing={false} 
                />
              </div>
            )}
            {/* --- FIN SKILLS --- */}

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