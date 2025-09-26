"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Bot, Sparkle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { apiClient } from "@/lib/api" // Importamos el cliente de API
import { useAuth } from "@/contexts/auth-context"

interface ChatMessage {
  id: string
  content: string
  sender: "user" | "jelli"
}

export function JelliChat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "init", content: "¡Hola! Soy Jelli. ¿En qué puedo ayudarte?", sender: "jelli" }
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: ChatMessage = { id: Date.now().toString(), content: inputValue, sender: "user" }
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    const historyForAI = [...messages, userMessage]
      .filter(msg => msg.id !== 'init')
      .map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));

    try {
      const response = await apiClient.post<{ response: string }>('/assistant/chat', { history: historyForAI });
      const jelliMessage: ChatMessage = { id: (Date.now() + 1).toString(), content: response.response, sender: "jelli" };
      setMessages(prev => [...prev, jelliMessage]);
    } catch (err) {
      const errorMsg: ChatMessage = { id: (Date.now() + 1).toString(), content: "Sorry, I'm having trouble connecting.", sender: "jelli" };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  }

  const handleNewChat = () => {
    setMessages([
      { id: "init-reset", content: "Ok, empecemos de nuevo. ¿En qué puedo ayudarte?", sender: "jelli" }
    ]);
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-jello-blue/5 to-jello-accent/5 rounded-2xl backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden">
        <>
          <div className="flex items-center justify-between p-4 border-b border-white/10 flex-shrink-0">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10 border-2 border-jello-blue/30"><Bot className=" m-auto"/></Avatar>
              <div>
                <h3 className="font-semibold text-foreground">Jelli</h3>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  Online
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleNewChat} title="Start new chat">
              <Sparkle className="w-4 h-4 mr-2" />
              New
            </Button>
          </div>

          <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.sender === "jelli" && <Avatar className="w-8 h-8 border border-jello-blue/30 flex-shrink-0"><Bot className=" m-auto"/></Avatar>}
                  <div className={`max-w-[80%] ${message.sender === "user" ? "order-first" : ""}`}>
                    <div className={`p-3 rounded-2xl ${message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-white/10 text-foreground"}`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content || "..."}</p>
                    </div>
                  </div>
                  {message.sender === "user" && 
                    <Avatar className="w-8 h-8 flex-shrink-0">
                        <AvatarImage src={user?.avatarUrl || "/placeholder.svg"} />
                        <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  }
                </motion.div>
              ))}
               {isLoading && (
                 <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3 justify-start"
                  >
                    <Avatar className="w-8 h-8 border border-jello-blue/30 flex-shrink-0"><Bot className=" m-auto"/></Avatar>
                    <div className="p-3 rounded-2xl bg-white/10 text-foreground">
                        <span className="animate-pulse">...</span>
                    </div>
                 </motion.div>
               )}
            </AnimatePresence>
          </div>

          <div className="p-4 border-t border-white/10 flex-shrink-0">
            <div className="flex gap-2 items-center">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Ask Jelli anything..."
                disabled={isLoading}
                className="bg-white/10 border-white/20"
              />
              <Button onClick={handleSendMessage} disabled={!inputValue.trim() || isLoading}><Send className="w-4 h-4" /></Button>
            </div>
          </div>
        </>
    </div>
  )
}

