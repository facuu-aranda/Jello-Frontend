"use client"

// Importa useState y useEffect de React
import { useState, useEffect } from "react" 
import { motion } from "framer-motion"
import { Bell, MessageSquare, Menu, Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SearchBar } from "@/components/search-bar"
import { UserMenu } from "@/components/user-menu"
import { NotificationPanel } from "@/components/notification-panel"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Sidebar } from "./sidebar"
import { useIsMobile } from "@/hooks/use-mobile"
import { useTheme } from "@/contexts/theme-context" // Asegúrate de tener esta importación

export function Header() {
  const [notificationCount] = useState(3)
  const isMobile = useIsMobile()
  const { theme, toggleTheme } = useTheme()

  // --- SOLUCIÓN DE HIDRATACIÓN ---
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])
  // --------------------------------

  return (
    <motion.header
      className="h-14 sm:h-16 glass-card border-b border-glass-border"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="flex items-center justify-between h-full px-3 sm:px-4 md:px-6">
        {/* Lógica del menú y la búsqueda */}
        <div className="flex items-center gap-2 flex-1">
          {/* ... (código existente) ... */}
          <div className="flex-1 max-w-xs sm:max-w-sm md:max-w-md">
            <SearchBar />
          </div>
        </div>
        
        {/* --- BOTÓN DE PRUEBA CORREGIDO --- */}
        {isMounted && (
          <button onClick={toggleTheme} className="p-2 border rounded-full">
            {theme === 'dark' ? <Sun/> : <Moon/>}
          </button>
        )}
        {/* --------------------------------- */}

        <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
          {/* ... (código existente de tus acciones y UserMenu) ... */}
          <UserMenu />
        </div>
      </div>
    </motion.header>
  )
}