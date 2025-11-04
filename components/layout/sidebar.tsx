"use client"
import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { Home, FolderKanban, CheckSquare, Search, Plus, ChevronsLeft, Bell, ClipboardList } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { UserMenu } from "@/components/user-menu"
import { cn } from "@/lib/utils"
import { CreateProjectModal } from "@/components/modals/create-project-modal"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { NotificationPanel } from "@/components/notification-panel"
import { Badge } from "@/components/ui/badge"
import { useApi } from "@/hooks/useApi";
import { ProjectSummary, Notification  } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Search", href: "/search", icon: Search },
  { name: "Projects", href: "/projects", icon: FolderKanban },
  { name: "My Tasks", href: "/tasks", icon: CheckSquare },
  { name: "Todos", href: "/todos", icon: ClipboardList },
]

interface SidebarProps {
  isCollapsed: boolean
  onToggle?: () => void
  isMobileView?: boolean
}

export function Sidebar({ isCollapsed, onToggle, isMobileView = false }: SidebarProps) {
  const pathname = usePathname()
  const { data: projects, isLoading: isLoadingProjects , refetch} = useApi<ProjectSummary[]>('/projects');
  
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false)
  
  const { data } = useApi<{ notifications: Notification[] }>('/notifications?page=1&limit=10');

const notificationCount = data?.notifications?.filter(n => !n.read).length || 0;

  const notificationButton = (
    <Button variant="ghost" size="icon" className="relative rounded-full">
      <Bell className="w-5 h-5" />
      {notificationCount > 0 && (
        <Badge variant="destructive" className="absolute top-1 right-1 h-4 w-4 p-0 flex items-center justify-center text-xs">{notificationCount}</Badge>
      )}
    </Button>
  );

  return (
    <>
      <TooltipProvider delayDuration={0}>
        <motion.aside
          data-collapsed={isCollapsed}
          className="group/sidebar h-full bg-sidebar/80 backdrop-blur-xl border-r border-glass-border flex flex-col z-20"
          animate={{ width: isCollapsed ? "5rem" : "16rem" }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <div className="flex flex-col h-full p-3">
            <div className={cn("flex items-center gap-3 mb-4", isCollapsed ? "justify-center" : "px-3")}>
              <Avatar className="w-8 h-8"><AvatarImage src="/images/jelli-avatar.png" alt="Jello" /><AvatarFallback>J</AvatarFallback></Avatar>
              <AnimatePresence>{!isCollapsed && (<motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="text-xl font-bold text-foreground whitespace-nowrap">Jello</motion.span>)}</AnimatePresence>
            </div>
            <div className="flex-grow overflow-y-auto space-y-4">
              <nav className="space-y-1 px-2">
                {navigation.map((item) => (
                  <Tooltip key={item.name} delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Link href={item.href} className={cn("flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors", pathname === item.href ? "bg-primary text-primary-foreground hover:bg-primary/90" : "text-muted-foreground hover:bg-muted", isCollapsed && "justify-center")}>
                        <item.icon className="h-5 w-5" />
                        <AnimatePresence>{!isCollapsed && (<motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="flex-grow">{item.name}</motion.span>)}</AnimatePresence>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">{item.name}</TooltipContent>
                  </Tooltip>
                ))}
              </nav>
              <div className="px-2">
                <div className={cn("mb-2 flex items-center", isCollapsed ? "justify-center" : "justify-between")}>
                  {!isCollapsed && (<motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="text-xs font-semibold text-muted-foreground uppercase">Projects</motion.span>)}
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className={cn("h-7 w-7 rounded-md", isCollapsed ? "" : "")} onClick={() => setIsCreateModalOpen(true)}><Plus className="h-4 w-4" /></Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">Create Project</TooltipContent>
                  </Tooltip>
                </div>
                <div className="space-y-1">
  {isLoadingProjects ? (
    Array.from({ length: 3 }).map((_, index) => (
      <div key={index} className="flex items-center gap-3 rounded-md px-3 py-2">
        <Skeleton className="h-2 w-2 rounded-full" />
        {!isCollapsed && <Skeleton className="h-4 w-full" />}
      </div>
    ))
  ) : (
    projects?.map((project) => (
      <Tooltip key={project.id} delayDuration={0}>
        <TooltipTrigger asChild>
          <Link href={`/project/${project.id}`} className={cn("flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted", pathname === `/project/${project.id}` ? "text-primary" : "text-muted-foreground", isCollapsed && "justify-center")}>
            <span className={cn("h-2 aspect-square w-2 min-w-2 rounded-full", project.color)} />
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="flex-grow truncate">
                  {project.name}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">{project.name}</TooltipContent>
      </Tooltip>
    ))
  )}
</div>
              </div>
            </div>
            {!isMobileView && (
              <div className="mt-auto pt-4 border-t border-border/50">
                <div className={cn("flex flex-col items-center gap-2")}>
                  <div className={cn("flex items-center w-full", isCollapsed ? "flex-col gap-2" : "justify-between")}>
                    <div className={cn("flex items-center", isCollapsed ? "flex-col gap-2" : "gap-1")}>
                      <Popover>
                        {isCollapsed ? (
                          <Tooltip>
                            <TooltipTrigger asChild><PopoverTrigger asChild>{notificationButton}</PopoverTrigger></TooltipTrigger>
                            <TooltipContent side="right">Notifications</TooltipContent>
                          </Tooltip>
                        ) : (
                          <PopoverTrigger asChild>{notificationButton}</PopoverTrigger>
                        )}
                        <PopoverContent side="right" align="start" className="p-0"><NotificationPanel /></PopoverContent>
                      </Popover>
                      <UserMenu />
                    </div>
                    {!isCollapsed && onToggle && (
                      <Button variant="ghost" size="icon" className="rounded-full" onClick={onToggle}><ChevronsLeft className="w-5 h-5" /></Button>
                    )}
                  </div>
                  {isCollapsed && onToggle && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="w-full rounded-xl" onClick={onToggle}><ChevronsLeft className="w-5 h-5 rotate-180" /></Button>
                      </TooltipTrigger>
                      <TooltipContent side="right">Expand</TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.aside>
      </TooltipProvider>
      <CreateProjectModal
  isOpen={isCreateModalOpen}
  onClose={() => setIsCreateModalOpen(false)}
  onProjectCreated={ refetch } 
/>
    </>
  )
}