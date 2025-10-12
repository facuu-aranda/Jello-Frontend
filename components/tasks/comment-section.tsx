// Jello-Frontend/components/tasks/comment-section.tsx

"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Send, Paperclip, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Comment } from "@/types"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent } from "@/components/ui/dialog" 

interface CommentSectionProps {
  comments: Comment[];
  taskId: string;
  // --- INICIO DE LA CORRECCIÓN: Props modificadas ---
  onSubmitComment: (content: string, attachmentFile: File | null) => Promise<void>;
  // --- FIN DE LA CORRECCIÓN ---
}

export function CommentSection({ comments, taskId, onSubmitComment }: CommentSectionProps) {
  const [newComment, setNewComment] = React.useState("")
  const [attachmentFile, setAttachmentFile] = React.useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [expandedImage, setExpandedImage] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setAttachmentFile(event.target.files[0]);
    }
  };

  // --- INICIO DE LA CORRECCIÓN: handleSubmit modificado ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() && !attachmentFile) return;

    setIsSubmitting(true);
    await onSubmitComment(newComment, attachmentFile);
    setNewComment("");
    setAttachmentFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setIsSubmitting(false);
  };
  // --- FIN DE LA CORRECCIÓN ---

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-foreground">Comments ({comments.length})</h4>
      <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
        {comments.map((comment, index) => (
          <motion.div 
            key={comment.id} 
            className="flex gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={comment.author.avatarUrl || ''} />
              <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-baseline gap-2">
                <p className="font-semibold text-sm">{comment.author.name}</p>
                <p className="text-xs text-muted-foreground">{new Date(comment.timestamp).toLocaleString()}</p>
              </div>
              <p className="text-sm text-foreground/90 whitespace-pre-wrap">{comment.content}</p>
              {comment.attachmentUrl && (
                <button 
                  onClick={() => setExpandedImage(comment.attachmentUrl!)}
                  className="mt-2 block cursor-pointer"
                >
                  <img 
                    src={comment.attachmentUrl} 
                    alt="Attachment" 
                    className="max-w-xs max-h-40 rounded-lg object-cover border border-border"
                  />
                </button>
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
            disabled={isSubmitting}
          />
        </div>

        {attachmentFile && (
            <div className="flex items-center justify-between p-2 bg-muted rounded-lg text-sm">
                <span className="truncate">{attachmentFile.name}</span>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setAttachmentFile(null)}>
                   <X className="h-4 w-4" />
                </Button>
            </div>
        )}
        
        <div className="flex justify-between items-center">
            <Button type="button" variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()} disabled={isSubmitting}>
                <Paperclip className="w-4 h-4" />
            </Button>
            <Input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />

            <Button type="submit" size="sm" disabled={(!newComment.trim() && !attachmentFile) || isSubmitting}>
                <Send className="w-4 h-4 mr-2" />
                {isSubmitting ? "Commenting..." : "Comment"}
            </Button>
        </div>
      </form>

    <Dialog open={!!expandedImage} onOpenChange={() => setExpandedImage(null)}>
      <DialogContent className="p-0 border-none bg-transparent w-auto max-w-4xl">
        <img src={expandedImage || ''} alt="Expanded attachment" className="w-full h-auto rounded-lg" />
      </DialogContent>
    </Dialog>
    </div>
  )
}