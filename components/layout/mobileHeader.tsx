"use client"
import * as React from "react"
import { Bell, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { NotificationPanel } from "@/components/notification-panel"
import { UserMenu } from "@/components/user-menu"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Sidebar } from "./sidebar"

export function MobileHeader() {
  const [notificationCount] = React.useState(3)

  const notificationButton = (
    <Button variant="ghost" size="icon" className="relative rounded-full">
      <Bell className="w-5 h-5" />
      {notificationCount > 0 && (
        <Badge variant="destructive" className="absolute top-1 right-1 h-4 w-4 p-0 flex items-center justify-center text-xs">{notificationCount}</Badge>
      )}
    </Button>
  );

  return (
    <header className="sticky top-0 z-40 w-full bg-sidebar/80 backdrop-blur-xl border-b border-glass-border p-3 flex items-center justify-between">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64 border-none bg-transparent">
          <Sidebar isCollapsed={false} isMobileView={true} />
        </SheetContent>
      </Sheet>

      <div className="flex items-center gap-1">
        <Popover>
          <PopoverTrigger asChild>{notificationButton}</PopoverTrigger>
          <PopoverContent side="bottom" align="end" className="p-0">
            <NotificationPanel />
          </PopoverContent>
        </Popover>
        <UserMenu />
      </div>
    </header>
  )
}