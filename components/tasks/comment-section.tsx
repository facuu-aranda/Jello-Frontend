"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Send, AtSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

interface Comment {
  id: string
  author: {
    id: string
    name: string
    avatar?: string
  }
  content: string
  timestamp: string
  mentions?: string[]
}

interface CommentSectionProps {
  comments: Comment[]
  onCommentAdd?: (content: string) => void
}

const mockComments: Comment[] = [
  {
    id: "1",
    author: { id: "1", name: "Sarah", avatar: "/sarah-avatar.png" },
    content: "I've started working on the wireframes. Should have the first draft ready by tomorrow.",
    timestamp: "2 hours ago",
  },
  {
    id: "2",
    author: { id: "2", name: "Mike", avatar: "/mike-avatar.jpg" },
    content: "@Sarah looks great! Can you also include the mobile version?",
    timestamp: "1 hour ago",
    mentions: ["Sarah"],
  },
  {
    id: "3",
    author: { id: "3", name: "Alex", avatar: "/diverse-user-avatars.png" },
    content: "I can help with the responsive design once the desktop version is finalized.",
    timestamp: "30 minutes ago",
  },
]

export function CommentSection({ comments = mockComments, onCommentAdd }: CommentSectionProps) {
  const [newComment, setNewComment] = React.useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newComment.trim()) {
      onCommentAdd?.(newComment.trim())
      setNewComment("")
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-foreground">Comments</h4>
        <span className="text-sm text-muted-foreground">{comments.length} comments</span>
      </div>

      {/* Comments List */}
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
              <AvatarImage src={comment.author.avatar || "/placeholder.svg"} alt={comment.author.name} />
              <AvatarFallback className="text-xs">{comment.author.name.charAt(0)}</AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm text-foreground">{comment.author.name}</span>
                <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
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

      {/* Add Comment Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <Textarea
            placeholder="Write a comment... Use @ to mention someone"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[80px] pr-12"
          />
          <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 w-8 h-8">
            <AtSign className="w-4 h-4" />
          </Button>
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
