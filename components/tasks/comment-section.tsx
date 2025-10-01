// Archivo: Jello-Frontend/components/tasks/comment-section.tsx

"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Send, AtSign, Paperclip, X } from "lucide-react" // Icons
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Comment } from "@/types"
import { Input } from "@/components/ui/input" // Input para el archivo

interface CommentSectionProps {
  comments: Comment[];
  // La función ahora recibe FormData en lugar de un string
  onCommentAdd: (formData: FormData) => void; 
}

export function CommentSection({ comments, onCommentAdd }: CommentSectionProps) {
  const [newComment, setNewComment] = React.useState("")
  const [attachmentFile, setAttachmentFile] = React.useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setAttachmentFile(event.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() && !attachmentFile) return; // No enviar si no hay nada

    // Construir FormData
    const formData = new FormData();
    formData.append('content', newComment.trim());
    if (attachmentFile) {
      formData.append('attachment', attachmentFile);
    }
    
    onCommentAdd(formData); // Enviar el FormData

    // Limpiar el formulario
    setNewComment("");
    setAttachmentFile(null);
    if(fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-foreground">Comments</h4>
        <span className="text-sm text-muted-foreground">{comments.length} comments</span>
      </div>

      <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
        {comments.map((comment, index) => (
          <motion.div
            key={comment.id}
            className="flex gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Avatar className="w-8 h-8">
              <AvatarImage src={comment.author.avatarUrl || "/placeholder.svg"} alt={comment.author.name} />
              <AvatarFallback className="text-xs">{comment.author.name.charAt(0)}</AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm text-foreground">{comment.author.name}</span>
                <span className="text-xs text-muted-foreground">{new Date(comment.timestamp).toLocaleString()}</span>
              </div>
              <div className="text-sm text-foreground whitespace-pre-wrap">
                {comment.content}
              </div>
              {/* Mostrar el adjunto si existe */}
              {comment.attachmentUrl && (
                 <a href={comment.attachmentUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline flex items-center gap-2">
                    <Paperclip className="w-4 h-4" />
                    Ver adjunto
                 </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <Textarea
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[80px] pr-12"
          />
        </div>

        {/* Vista previa del archivo a subir */}
        {attachmentFile && (
            <div className="flex items-center justify-between p-2 bg-muted rounded-lg text-sm">
                <span className="truncate">{attachmentFile.name}</span>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setAttachmentFile(null)}>
                    <X className="h-4 w-4" />
                </Button>
            </div>
        )}
        
        <div className="flex justify-between items-center">
            {/* Botón para adjuntar archivo */}
            <Button type="button" variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()}>
                <Paperclip className="w-4 h-4" />
            </Button>
            <Input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />

            <Button type="submit" size="sm" disabled={!newComment.trim() && !attachmentFile}>
                <Send className="w-4 h-4 mr-2" />
                Comment
            </Button>
        </div>
      </form>
    </div>
  )
}