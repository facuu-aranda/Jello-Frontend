"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Paperclip, Mic, MoreVertical, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface ChatMessage {
  id: string
  content: string
  sender: "user" | "jelli"
  timestamp: Date
  type?: "text" | "suggestion" | "task"
}

const mockMessages: ChatMessage[] = [
  {
    id: "1",
    content: "Hi there! I'm Jelli, your productivity partner! How can I help you get things done today?",
    sender: "jelli",
    timestamp: new Date(Date.now() - 300000),
  },
  {
    id: "2",
    content: "Can you help me organize my tasks for this week?",
    sender: "user",
    timestamp: new Date(Date.now() - 240000),
  },
  {
    id: "3",
    content:
      "I can see you have 12 tasks across 3 projects. Let me suggest a prioritization strategy based on your deadlines and workload.",
    sender: "jelli",
    timestamp: new Date(Date.now() - 180000),
    type: "suggestion",
  },
]

const suggestions = [
  "Create a new project",
  "Schedule a team meeting",
  "Set up daily standup reminders",
  "Analyze my productivity trends",
]

export function JelliChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages)
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, newMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate Jelli response
    setTimeout(() => {
      const jelliResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content:
          "I understand! Let me help you with that. I'm analyzing your current workload and will provide some personalized suggestions.",
        sender: "jelli",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, jelliResponse])
      setIsTyping(false)
    }, 2000)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion)
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-jello-blue/5 to-jello-accent/5 rounded-2xl backdrop-blur-xl border border-white/20">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          >
            <Avatar className="w-12 h-12 border-2 border-jello-blue/30">
              <img src="/images/jelli-avatar.png" alt="Jelli" className="w-full h-full object-cover" />
            </Avatar>
          </motion.div>
          <div>
            <h3 className="font-semibold text-foreground">Jelli</h3>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Always here to help
            </p>
          </div>
        </div>
        <Button variant="ghost" size="sm">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.sender === "jelli" && (
                <Avatar className="w-8 h-8 border border-jello-blue/30">
                  <img src="/images/jelli-avatar.png" alt="Jelli" className="w-full h-full object-cover" />
                </Avatar>
              )}

              <div className={`max-w-[70%] ${message.sender === "user" ? "order-first" : ""}`}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`p-4 rounded-2xl backdrop-blur-sm border ${
                    message.sender === "user"
                      ? "bg-jello-blue text-white border-jello-blue/30 ml-auto"
                      : "bg-white/10 text-foreground border-white/20"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  {message.type === "suggestion" && (
                    <Badge variant="secondary" className="mt-2">
                      <Sparkles className="w-3 h-3 mr-1" />
                      AI Suggestion
                    </Badge>
                  )}
                </motion.div>
                <p className="text-xs text-muted-foreground mt-1 px-2">
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>

              {message.sender === "user" && (
                <Avatar className="w-8 h-8 border border-jello-blue/30">
                  <img src="/sarah-avatar.png" alt="You" className="w-full h-full object-cover" />
                </Avatar>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
            <Avatar className="w-8 h-8 border border-jello-blue/30">
              <img src="/images/jelli-avatar.png" alt="Jelli" className="w-full h-full object-cover" />
            </Avatar>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4">
              <div className="flex gap-1">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY, delay: 0 }}
                  className="w-2 h-2 bg-jello-blue rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY, delay: 0.2 }}
                  className="w-2 h-2 bg-jello-blue rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY, delay: 0.4 }}
                  className="w-2 h-2 bg-jello-blue rounded-full"
                />
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestions */}
      <div className="px-6 py-3 border-t border-white/10">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {suggestions.map((suggestion, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => handleSuggestionClick(suggestion)}
              className="whitespace-nowrap bg-white/5 border-white/20 hover:bg-white/10"
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-white/10">
        <div className="flex gap-3 items-end">
          <div className="flex-1 relative">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Ask Jelli anything..."
              className="pr-20 bg-white/10 border-white/20 focus:border-jello-blue/50"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Paperclip className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Mic className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className="bg-jello-blue hover:bg-jello-blue/90"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
