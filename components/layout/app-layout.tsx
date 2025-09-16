"use client"

import * as React from "react"
import { Sidebar } from "./sidebar"
import { AnimatedBackground } from "@/components/animated-background"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const isMobile = useIsMobile()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(true)
  const [isSheetOpen, setIsSheetOpen] = React.useState(false)

  if (isMobile) {
    return (
      <div className="min-h-screen relative">
        <AnimatedBackground />
        <div className="relative z-10 flex flex-col h-screen">
          <header className="flex items-center h-14 px-4 border-b border-border/50 flex-shrink-0">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64 border-none bg-transparent">
                <Sidebar isCollapsed={false} />
              </SheetContent>
            </Sheet>
          </header>
          <main className="flex-1 p-3 sm:p-4 overflow-y-auto">{children}</main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      {/* 👇 --- CONTENEDOR PRINCIPAL CORREGIDO --- 👇 */}
      <div className="relative z-10 flex h-screen w-screen overflow-hidden">
        <Sidebar isCollapsed={isSidebarCollapsed} onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />

        <div className="flex-1 flex flex-col min-w-0">
          <main className="flex-1 p-3 sm:p-4 md:p-6 overflow-y-auto">{children}</main>
        </div>
      </div>
    </div>
  )
}