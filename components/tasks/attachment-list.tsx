// Jello-Frontend/components/tasks/AttachmentList.tsx
"use client"

import * as React from 'react'
import { Attachment } from "@/types"
import { Button } from '@/components/ui/button'
import { Paperclip, FileText, Image as ImageIcon, Trash2, Download } from 'lucide-react'
import Image from 'next/image'

interface AttachmentListProps {
  attachments: Attachment[]
  isEditing: boolean
  taskId: string
  onAttachmentAdd: (files: FileList) => void
  onAttachmentDelete: (id: string) => void
  onAttachmentView?: (id: string) => void
}

export function AttachmentList({
  attachments,
  isEditing,
  onAttachmentAdd,
  onAttachmentDelete,
  onAttachmentView
}: AttachmentListProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onAttachmentAdd(e.target.files)
      e.target.value = '' // Reset input
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-foreground flex items-center gap-2">
          <Paperclip className="w-4 h-4" />
          Attachments
        </h4>
        {isEditing && (
          <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()}>
            Add
          </Button>
        )}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          multiple
          onChange={handleFileSelect}
        />
      </div>

      <div className="space-y-2">
        {attachments.length === 0 ? (
          <p className="text-sm text-muted-foreground">No attachments yet.</p>
        ) : (
          attachments.map(att => (
            <div key={att._id} className="flex items-center gap-3 p-2 bg-muted rounded-lg group">
              {att.type === 'image' ? (
                // Si es una imagen, mostramos una miniatura
                <div 
                  className="relative w-12 h-12 flex-shrink-0 bg-background rounded-md overflow-hidden cursor-pointer"
                  onClick={() => onAttachmentView?.(att._id)}
                >
                  <Image src={att.url} alt={att.name} layout="fill" objectFit="cover" />
                </div>
              ) : (
                // Si es otro tipo de archivo, mostramos un ícono
                <div className="w-12 h-12 flex-shrink-0 bg-background rounded-md flex items-center justify-center">
                  <FileText className="w-6 h-6 text-muted-foreground" />
                </div>
              )}
              
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium truncate">{att.name}</p>
                <span className="text-xs text-muted-foreground">{att.size}</span>
              </div>
              
              {/* Botón de descarga siempre visible */}
              <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                <a href={att.url} target="_blank" rel="noopener noreferrer" download>
                  <Download className="w-4 h-4" />
                </a>
              </Button>

              {isEditing && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => onAttachmentDelete(att._id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}