"use client"

import type * as React from "react"
import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { AnimatedBackground } from "@/components/animated-background"
import { useIsMobile } from "@/hooks/use-mobile"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const isMobile = useIsMobile()

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />

      <div className="relative z-10 flex">
        {/* Sidebar - Hidden on mobile, shown as overlay */}
        {!isMobile && <Sidebar />}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <Header />

          {/* Page Content */}
          <main className="flex-1 p-3 sm:p-4 md:p-6">{children}</main>
        </div>
      </div>
    </div>
  )
}
