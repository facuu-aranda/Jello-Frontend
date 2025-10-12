// Jello-Frontend/components/modals/AttachmentViewerModal.tsx
"use client"

import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Modal, ModalContent } from "@/components/ui/modal"
import { Button } from '@/components/ui/button'
import { X, Download, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react'
import { Attachment } from '@/types'

interface AttachmentViewerModalProps {
  isOpen: boolean
  onClose: () => void
  attachments: Attachment[]
  selectedAttachmentId: string | null
}

export function AttachmentViewerModal({
  isOpen,
  onClose,
  attachments,
  selectedAttachmentId,
}: AttachmentViewerModalProps) {
  const [currentIndex, setCurrentIndex] = React.useState<number | null>(null)

  // Sincroniza el índice actual cuando cambia el adjunto seleccionado
  React.useEffect(() => {
    if (selectedAttachmentId) {
      const index = attachments.findIndex((att) => att._id === selectedAttachmentId)
      setCurrentIndex(index !== -1 ? index : null)
    } else {
      setCurrentIndex(null)
    }
  }, [selectedAttachmentId, attachments])

  // Lógica para navegar entre adjuntos
  const handleNext = () => {
    if (currentIndex === null || attachments.length === 0) return
    setCurrentIndex((prev) => (prev! + 1) % attachments.length)
  }

  const handlePrev = () => {
    if (currentIndex === null || attachments.length === 0) return
    setCurrentIndex((prev) => (prev! - 1 + attachments.length) % attachments.length)
  }

  // Manejo de atajos de teclado
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      if (e.key === 'ArrowRight') handleNext()
      if (e.key === 'ArrowLeft') handlePrev()
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, handleNext, handlePrev, onClose])

  const currentAttachment = currentIndex !== null ? attachments[currentIndex] : null

  if (!isOpen || !currentAttachment) {
    return null
  }

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent className="max-w-screen-xl w-[95vw] h-[90vh] p-0 bg-transparent border-0 shadow-none flex items-center justify-center">
        {/* Botón de cierre */}
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-4 right-4 z-50 rounded-full bg-black/50 text-white hover:bg-black/70 hover:text-white"
          onClick={onClose}
        >
          <X className="w-6 h-6" />
        </Button>

        {/* Navegación (Anterior) */}
        {attachments.length > 1 && (
          <Button
            size="icon"
            variant="ghost"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 rounded-full bg-black/50 text-white hover:bg-black/70 hover:text-white h-12 w-12"
            onClick={handlePrev}
          >
            <ChevronLeft className="w-8 h-8" />
          </Button>
        )}

        {/* Contenido Principal (Imagen y Acciones) */}
        <motion.div
          key={currentAttachment._id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full h-full flex flex-col items-center justify-center relative p-16"
        >
          {/* Header con información */}
          <motion.div className="absolute top-4 left-4 right-4 text-center text-white text-shadow-lg bg-black/30 p-2 rounded-lg z-20">
            <p className="font-bold truncate">{currentAttachment.name}</p>
            <p className="text-sm opacity-80">{currentIndex! + 1} / {attachments.length}</p>
          </motion.div>
          
          <img
            src={currentAttachment.url}
            alt={currentAttachment.name}
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          />

          {/* Footer con acciones */}
          <motion.div className="absolute bottom-4 flex gap-4 z-20">
            <Button asChild variant="secondary">
              <a href={currentAttachment.url} download target="_blank" rel="noopener noreferrer">
                <Download className="mr-2 h-4 w-4" /> Descargar
              </a>
            </Button>
            <Button asChild variant="secondary">
              <a href={currentAttachment.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" /> Abrir en nueva pestaña
              </a>
            </Button>
          </motion.div>
        </motion.div>

        {/* Navegación (Siguiente) */}
        {attachments.length > 1 && (
          <Button
            size="icon"
            variant="ghost"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-50 rounded-full bg-black/50 text-white hover:bg-black/70 hover:text-white h-12 w-12"
            onClick={handleNext}
          >
            <ChevronRight className="w-8 h-8" />
          </Button>
        )}
      </ModalContent>
    </Modal>
  )
}