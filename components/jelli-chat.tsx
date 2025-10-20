"use client"

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, Sparkle, Ban, Plus, LoaderCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { apiClient } from "@/lib/api";
import { useAuth } from "@/contexts/auth-context";
import { TaskSummary } from "@/types";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "jelli";
}

export function JelliChat() {
  const { user } = useAuth();
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    { id: "init", content: "¡Hola! Soy Jelli. ¿En qué puedo ayudarte?", sender: "jelli" }
  ]);
  const [inputValue, setInputValue] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  
  // Estados para gestionar la sesión de IA nativa
  const [session, setSession] = React.useState<AITextSession | null>(null);
  const [status, setStatus] = React.useState<'loading' | 'downloading' | 'ready' | 'unsupported'>('loading');

  const messagesContainerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Efecto para inicializar el modelo de IA al cargar el componente
  React.useEffect(() => {
    async function initializeAi() {
      if (window.ai) {
        try {
          const available = await window.ai.canCreateTextSession('gemini-nano');
          
          if (available === 'no') {
            setStatus('unsupported');
            return;
          }
  
          if (available === 'after-download') {
            setStatus('downloading');
          }
  
          // createTextSession() iniciará la descarga si es necesario y esperará a que termine.
          const newSession = await window.ai.createTextSession();
          setSession(newSession);
          setStatus('ready');
        } catch (error) {
            console.error("Error al inicializar la sesión de IA:", error);
            setStatus('unsupported');
        }
      } else {
        setStatus('unsupported');
      }
    }
    initializeAi();

    // Limpieza al desmontar el componente
    return () => {
      session?.destroy();
    };
  }, [session]);

  // Efecto para hacer scroll automático al final del chat
  React.useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Función para obtener y añadir el contexto de las tareas
  const handleAddTaskContext = async () => {
    toast.info("Obteniendo contexto de tareas...");
    try {
      const tasks = await apiClient.get<TaskSummary[]>('/tasks/my-tasks');
      if (tasks && tasks.length > 0) {
        const taskTitles = tasks.map(t => `- ${t.title} (Estado: ${t.status})`).join('\n');
        const contextPrompt = `Considerando mis tareas actuales, que son:\n${taskTitles}\n\n---\n\nQuiero preguntarte lo siguiente: `;
        
        setInputValue(contextPrompt);
        toast.success("Contexto de tareas añadido al chat.");
        inputRef.current?.focus(); // Pone el foco en el input
      } else {
        toast.info("No tienes tareas para añadir como contexto.");
      }
    } catch (error) {
      toast.error("No se pudo obtener el contexto de las tareas.");
      console.error("Error fetching task context:", error);
    }
  };

  // Función para enviar mensajes
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = { id: Date.now().toString(), content: inputValue, sender: "user" };
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    const jelliMessageId = (Date.now() + 1).toString();

    // Manejo del caso en que la IA no es compatible
    if (status !== 'ready' || !session) {
      setTimeout(() => {
        const unsupportedMessage = "Lo siento, la IA integrada no está disponible en tu navegador.\n\nEsta función requiere **Chrome 127** o superior con las funciones experimentales activadas. Estoy simulando una respuesta para que veas cómo funcionaría.";
        setMessages(prev => [...prev, { id: jelliMessageId, content: unsupportedMessage, sender: "jelli" }]);
        setIsLoading(false);
      }, 500);
      return;
    }

    // Lógica para la IA compatible
    setMessages(prev => [...prev, { id: jelliMessageId, content: "", sender: "jelli" }]);

    try {
      const stream = session.promptStreaming(inputValue);

      for await (const chunk of stream) {
        setMessages(prev => prev.map(msg => 
          msg.id === jelliMessageId 
            ? { ...msg, content: msg.content + chunk } 
            : msg
        ));
      }
    } catch (err) {
      const errorMsgContent = "Lo siento, he tenido un problema al procesar tu solicitud.";
      setMessages(prev => prev.map(msg => 
        msg.id === jelliMessageId
          ? { ...msg, content: errorMsgContent }
          : msg
      ));
    } finally {
      setIsLoading(false);
    }
  };

  // Resetea el chat a su estado inicial
  const handleNewChat = async () => {
    session?.destroy();
    setMessages([{ id: "init-reset", content: "Ok, empecemos de nuevo. ¿En qué puedo ayudarte?", sender: "jelli" }]);
    if (window.ai) {
        setStatus('loading');
        const newSession = await window.ai.createTextSession();
        setSession(newSession);
        setStatus('ready');
    }
  };

  return (
    <TooltipProvider>
      <div className="flex flex-col h-full bg-gradient-to-br from-jello-blue/5 to-jello-accent/5 rounded-2xl backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10 border-2 border-jello-blue/30">
  <AvatarImage src="/images/jelli-avatar.png" alt="Jelli" />
  <AvatarFallback>J</AvatarFallback>
</Avatar>
            <div>
              <h3 className="font-semibold text-foreground">Jelli</h3>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                {status === 'ready' && <><span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> Online</>}
                {status === 'loading' && <><LoaderCircle className="w-3 h-3 animate-spin" /> Inicializando IA...</>}
                {status === 'downloading' && <><Download className="w-3 h-3 text-blue-400 animate-pulse" /> Descargando modelo...</>}
                {status === 'unsupported' && <><Ban className="w-3 h-3 text-red-400" /> IA no disponible</>}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleNewChat} title="Iniciar nuevo chat">
            <Sparkle className="w-4 h-4 mr-2" />
            Nuevo
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
                {message.sender === "jelli" && <Avatar className="w-10 h-10 border-2 border-jello-blue/30">
  <AvatarImage src="/images/jelli-avatar.png" alt="Jelli" />
  <AvatarFallback>J</AvatarFallback>
</Avatar>}
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
             {isLoading && messages[messages.length -1]?.sender === 'user' && (
               <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3 justify-start"
                >
                  <Avatar className="w-10 h-10 border-2 border-jello-blue/30">
  <AvatarImage src="/images/jelli-avatar.png" alt="Jelli" />
  <AvatarFallback>J</AvatarFallback>
</Avatar>
                  <div className="p-3 rounded-2xl bg-white/10 text-foreground">
                    <span className="animate-pulse">...</span>
                  </div>
               </motion.div>
             )}
          </AnimatePresence>
        </div>

        <div className="p-4 border-t border-white/10 flex-shrink-0">
          <div className="flex gap-2 items-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={handleAddTaskContext} disabled={isLoading}>
                  <Plus className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Añadir contexto de tareas</p>
              </TooltipContent>
            </Tooltip>
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder={status !== 'ready' ? "IA no disponible, pero puedes enviar un mensaje." : "Pregúntale a Jelli..."}
              disabled={isLoading && status === 'ready'}
              className="bg-white/10 border-white/20"
            />
            <Button onClick={handleSendMessage} disabled={!inputValue.trim() || isLoading}><Send className="w-4 h-4" /></Button>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}