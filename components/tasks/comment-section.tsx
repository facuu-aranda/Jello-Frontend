"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Send, AtSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Comment } from "@/types"

interface CommentSectionProps {
  comments: Comment[];
  onCommentAdd: (content: string) => void;
}

export function CommentSection({ comments, onCommentAdd }: CommentSectionProps) {
  const [newComment, setNewComment] = React.useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newComment.trim()) {
      onCommentAdd(newComment.trim())
      setNewComment("")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-foreground">Comments</h4>
        <span className="text-sm text-muted-foreground">{comments.length} comments</span>
      </div>

      <div className="space-y-4 max-h-64 overflow-y-auto">
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

            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm text-foreground">{comment.author.name}</span>
                <span className="text-xs text-muted-foreground">{new Date(comment.timestamp).toLocaleString()}</span>
              </div>
              <div className="text-sm text-foreground">
                {comment.content.split(" ").map((word, i) => (
                  <span key={i}>
                    {word.startsWith("@") ? <span className="text-primary font-medium">{word}</span> : word}
                    {i < comment.content.split(" ").length - 1 && " "}
                  </span>
                ))}
              </div>
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
        <div className="flex justify-end">
          <Button type="submit" size="sm" disabled={!newComment.trim()}>
            <Send className="w-4 h-4 mr-2" />
            Comment
          </Button>
        </div>
      </form>
    </div>
  )
}
