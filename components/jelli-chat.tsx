"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, MoreVertical, Bot, RefreshCw, Sparkle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

interface ChatMessage {
  id: string
  content: string
  sender: "user" | "jelli"
  timestamp: Date
}

// --- Sub-componente para la UI de Carga ---
const JelliLoading = ({ status, progress, error, onRetry }: { status: string, progress: number, error: string | null, onRetry: () => void }) => (
  <div className="flex flex-col items-center justify-center h-full text-center p-6">
    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
      <Avatar className="w-16 h-16 border-4 mb-4 border-jello-blue/30"><Bot className="w-8 h-8 m-auto" /></Avatar>
    </motion.div>
    <h3 className="text-lg font-semibold text-foreground mb-2">Jelli se está preparando</h3>
    <p className="text-sm text-muted-foreground mb-4 max-w-xs">
      {error ? error : "Es la primera vez que cargas el asistente. La descarga continuará en segundo plano."}
    </p>
    {!error && (
      <div className="w-full max-w-sm space-y-2">
        <Progress value={progress} className="h-2" />
        <p className="text-xs text-muted-foreground">{status}</p>
      </div>
    )}
    {error && (
      <Button variant="destructive" onClick={onRetry} className="mt-4">
        <RefreshCw className="w-4 h-4 mr-2" />
        Reintentar
      </Button>
    )}
  </div>
)

export function JelliChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isReady, setIsReady] = useState(false)
  const [engineStatus, setEngineStatus] = useState("Initializing...")
  const [engineError, setEngineError] = useState<string | null>(null)
  const [loadProgress, setLoadProgress] = useState(0)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const workerRef = useRef<Worker | null>(null)

  const initializeWorker = useCallback(() => {
    if (window.Worker) {
      const worker = new Worker("/llm-worker.js", { type: "module" });
      workerRef.current = worker

      worker.postMessage({ type: 'load' })

      worker.onmessage = (event) => {
        const { type, payload } = event.data
        switch (type) {
          case 'load-progress':
            setEngineStatus(payload.text)
            setLoadProgress(payload.progress * 100)
            break
          case 'load-complete':
            setIsReady(true)
            setEngineStatus("Ready!")
            setMessages([{ id: "init", content: "¡Hola! Soy Jelli. ¿En qué puedo ayudarte?", sender: "jelli", timestamp: new Date() }])
            break
          case 'load-error':
            setEngineError(payload)
            break
          case 'chat-chunk':
            setMessages(prev => {
              const newMessages = [...prev];
              const lastMessage = newMessages[newMessages.length - 1];

              if (lastMessage && lastMessage.sender === 'jelli') {
                const updatedMessage = {
                  ...lastMessage,
                  content: lastMessage.content + payload,
                };
                newMessages[newMessages.length - 1] = updatedMessage;
                return newMessages;
              }
              return prev;
            });
            break
        }
      }
    }
  }, [])

  useEffect(() => {
    initializeWorker()
    return () => workerRef.current?.terminate()
  }, [initializeWorker])

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !isReady) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    // 👇 --- SECCIÓN CORREGIDA Y OPTIMIZADA --- 👇
    // 1. Preparamos el historial para la IA, asegurándonos de que esté limpio y correcto.
    const historyForAI = [...messages, userMessage]
      .filter(msg => msg.id !== 'init' && msg.id !== 'init-reset') // Filtramos mensajes iniciales
      .map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));

    // 2. Enviamos el historial limpio al worker.
    workerRef.current?.postMessage({ type: 'chat', payload: { history: historyForAI } });

    // 3. Actualizamos la UI de forma optimista.
    setMessages(prev => [
      ...prev,
      userMessage,
      { id: (Date.now() + 1).toString(), content: "", sender: "jelli", timestamp: new Date() }
    ]);

    setInputValue("")
    // 👆 --- FIN DE LA SECCIÓN CORREGIDA --- 👆
  }

  const handleNewChat = () => {
    workerRef.current?.postMessage({ type: 'reset' });
    setMessages([
      { id: "init-reset", content: "Ok, empecemos de nuevo. ¿En qué puedo ayudarte?", sender: "jelli", timestamp: new Date() }
    ]);
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-jello-blue/5 to-jello-accent/5 rounded-2xl backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden">
      {!isReady ? (
        <JelliLoading status={engineStatus} progress={loadProgress} error={engineError} onRetry={initializeWorker} />
      ) : (
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
                  {message.sender === "user" && <Avatar className="w-8 h-8 flex-shrink-0"><AvatarImage src="/sarah-avatar.png" /></Avatar>}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="p-4 border-t border-white/10 flex-shrink-0">
            <div className="flex gap-2 items-center">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Ask Jelli anything..."
                disabled={!isReady}
                className="bg-white/10 border-white/20"
              />
              <Button onClick={handleSendMessage} disabled={!inputValue.trim() || !isReady}><Send className="w-4 h-4" /></Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}