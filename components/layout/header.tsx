"use client"

import * as React from "react"
import { Bell, MessageSquare, Menu } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SearchBar } from "@/components/search-bar"
import { UserMenu } from "@/components/user-menu"
import { NotificationPanel } from "@/components/notification-panel"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Sidebar } from "./sidebar"
import { useIsMobile } from "@/hooks/use-mobile"

export function Header() {
  const [notificationCount] = React.useState(3)
  const isMobile = useIsMobile()

  return (
    <motion.header
      className="h-14 sm:h-16 glass-card border-b border-glass-border"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="flex items-center justify-between h-full px-3 sm:px-4 md:px-6">
        {/* Mobile Menu + Search */}
        <div className="flex items-center gap-2 flex-1">
          {/* Mobile Hamburger Menu */}
          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64">
                <Sidebar />
              </SheetContent>
            </Sheet>
          )}

          {/* Search - Responsive width */}
          <div className="flex-1 max-w-xs sm:max-w-sm md:max-w-md">
            <SearchBar />
          </div>
        </div>

        {/* Actions - Responsive spacing */}
        <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
          {/* AI Chat Button - Hidden on small mobile */}
          <Button variant="ghost" size="icon" className="hidden xs:flex relative">
            <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>

          {/* Notifications */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                {notificationCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 text-xs flex items-center justify-center p-0"
                  >
                    {notificationCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 sm:w-80 p-0" align="end">
              <NotificationPanel />
            </PopoverContent>
          </Popover>

          {/* User Menu */}
          <UserMenu />
        </div>
      </div>
    </motion.header>
  )
}
