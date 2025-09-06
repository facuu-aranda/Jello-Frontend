"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Upload, File, Image, Download, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Attachment {
  id: string
  name: string
  size: string
  type: "image" | "document" | "other"
  url: string
  uploadedBy: string
  uploadedAt: string
}

interface AttachmentListProps {
  attachments: Attachment[]
  onAttachmentAdd?: (files: FileList) => void
  onAttachmentDelete?: (id: string) => void
}

const mockAttachments: Attachment[] = [
  {
    id: "1",
    name: "homepage-wireframe.png",
    size: "2.4 MB",
    type: "image",
    url: "/placeholder.svg",
    uploadedBy: "Sarah",
    uploadedAt: "2 hours ago",
  },
  {
    id: "2",
    name: "requirements.pdf",
    size: "1.8 MB",
    type: "document",
    url: "/placeholder.svg",
    uploadedBy: "Mike",
    uploadedAt: "1 day ago",
  },
]

export function AttachmentList({
  attachments = mockAttachments,
  onAttachmentAdd,
  onAttachmentDelete,
}: AttachmentListProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onAttachmentAdd?.(e.target.files)
    }
  }

  const getFileIcon = (type: Attachment["type"]) => {
    switch (type) {
      case "image":
        return Image
      case "document":
        return File
      default:
        return File
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-foreground">Attachments</h4>
        <Button variant="ghost" size="sm" onClick={() => fileInputRef.current?.click()}>
          <Upload className="w-4 h-4 mr-2" />
          Upload
        </Button>
      </div>

      {/* Hidden File Input */}
      <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileSelect} />

      {/* Attachments List */}
      <div className="space-y-2">
        {attachments.map((attachment, index) => {
          const FileIcon = getFileIcon(attachment.type)

          return (
            <motion.div
              key={attachment.id}
              className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="w-8 h-8 rounded bg-muted flex items-center justify-center">
                <FileIcon className="w-4 h-4 text-muted-foreground" />
              </div>

              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium text-foreground">{attachment.name}</p>
                <p className="text-xs text-muted-foreground">
                  {attachment.size} • Uploaded by {attachment.uploadedBy} • {attachment.uploadedAt}
                </p>
              </div>

              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="w-8 h-8">
                  <Download className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8"
                  onClick={() => onAttachmentDelete?.(attachment.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Upload Area */}
      <motion.div
        className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Drop files here or <span className="text-primary">browse</span>
        </p>
      </motion.div>
    </div>
  )
}
