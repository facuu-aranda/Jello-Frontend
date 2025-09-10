"use client"

import * as React from "react"
import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { AnimatedBackground } from "@/components/animated-background"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { MessageSquare, X } from "lucide-react"
import { JelliChat } from "@/components/jelli-chat"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const isMobile = useIsMobile()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false)
  const [isChatOpen, setIsChatOpen] = React.useState(false)
  const [isChatInitialized, setIsChatInitialized] = React.useState(false) // Nuevo estado para la carga perezosa

  const handleFabClick = () => {
    // Si es el primer clic, inicializa el chat. En clics posteriores, solo lo abre/cierra.
    if (!isChatInitialized) {
      setIsChatInitialized(true)
    }
    setIsChatOpen(!isChatOpen)
  }

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />

      <div className="relative z-10 flex">
        {!isMobile && <Sidebar isCollapsed={isSidebarCollapsed} onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />}

        <div className={cn("flex-1 flex flex-col min-w-0 transition-all duration-300", !isMobile && (isSidebarCollapsed ? "pl-20" : "pl-64"))}>
          <Header />
          <main className="flex-1 p-3 sm:p-4 md:p-6">{children}</main>
        </div>
      </div>

      {/* Botón Flotante (FAB) para el Chat */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.5 }}
      >
        <Button
          size="lg"
          className="rounded-full w-16 h-16 shadow-lg bg-primary hover:bg-primary-hover"
          onClick={handleFabClick}
        >
          <AnimatePresence initial={false}>
            <motion.div
              key={isChatOpen ? "close" : "chat"}
              initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
            >
              {isChatOpen ? <X className="w-8 h-8" /> : <MessageSquare className="w-8 h-8" />}
            </motion.div>
          </AnimatePresence>
        </Button>
      </motion.div>

      {/* El chat solo se renderiza después de la primera inicialización */}
      {isChatInitialized && (
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              className="fixed bottom-24 right-6 z-50 w-[400px] h-[600px] shadow-2xl origin-bottom-right"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ ease: "easeOut", duration: 0.2 }}
            >
              <JelliChat />
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  )
}