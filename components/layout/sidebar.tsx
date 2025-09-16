"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { Home, FolderKanban, CheckSquare, Settings, Plus, ChevronsLeft, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { SearchBar } from "@/components/search-bar"
import { UserMenu } from "@/components/user-menu"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Projects", href: "/projects", icon: FolderKanban },
  { name: "My Tasks", href: "/tasks", icon: CheckSquare },
]

const projects = [
  { id: 1, name: "Website Redesign", color: "bg-accent-pink" },
  { id: 2, name: "Mobile App", color: "bg-accent-purple" },
  { id: 3, name: "Marketing Campaign", color: "bg-accent-teal" },
]

interface SidebarProps {
  isCollapsed: boolean
  onToggle?: () => void
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname()

  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside
        data-collapsed={isCollapsed}
        className="group/sidebar h-full bg-sidebar/80 backdrop-blur-xl border-r border-glass-border flex flex-col z-20"
        animate={{ width: isCollapsed ? "5rem" : "16rem" }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <div className="flex flex-col h-full p-3">
          <div className={cn("flex items-center gap-3 mb-4", isCollapsed ? "justify-center" : "px-3")}>
            <Avatar className="w-8 h-8">
              <AvatarImage src="/images/jelli-avatar.png" alt="Jello" />
              <AvatarFallback>J</AvatarFallback>
            </Avatar>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="text-xl font-bold text-foreground whitespace-nowrap">
                  Jello
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <div className="px-2 mb-4">
            <SearchBar />
          </div>

          <div className="flex-grow overflow-y-auto space-y-4">
            <nav className="space-y-1 px-2">
              {navigation.map((item) => {
                const isActive = pathname.startsWith(item.href)
                return (
                  <Tooltip key={item.name}>
                    <TooltipTrigger asChild>
                      <Link href={item.href}>
                        <div className={cn("flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors", isActive ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground hover:bg-accent", isCollapsed && "justify-center")}>
                          <item.icon className="w-5 h-5 shrink-0" />
                          <AnimatePresence>
                            {!isCollapsed && <motion.span initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "auto" }} exit={{ opacity: 0, width: 0 }} className="whitespace-nowrap">{item.name}</motion.span>}
                          </AnimatePresence>
                        </div>
                      </Link>
                    </TooltipTrigger>
                    {isCollapsed && <TooltipContent side="right">{item.name}</TooltipContent>}
                  </Tooltip>
                )
              })}
            </nav>
            <div className="px-2">
              <div className={cn("flex items-center justify-between mb-2", isCollapsed ? "justify-center" : "px-3")}>
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.h3 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-xs font-semibold text-muted-foreground whitespace-nowrap uppercase">
                      Projects
                    </motion.h3>
                  )}
                </AnimatePresence>
                <Button size="icon" variant="ghost" className="w-6 h-6 shrink-0">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-1">
                {projects.map((project) => (
                  <Tooltip key={project.id}>
                    <TooltipTrigger asChild>
                      <Link href={`/project/${project.id}`}>
                        <div className={cn("flex items-center gap-3 px-3 py-2 rounded-xl text-sm hover:bg-accent transition-colors", isCollapsed && "justify-center")}>
                          <div className={cn("w-3 h-3 rounded-full shrink-0", project.color)} />
                          <AnimatePresence>
                            {!isCollapsed && (
                              <motion.span initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "auto" }} exit={{ opacity: 0, width: 0 }} className="flex-1 text-foreground font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                                {project.name}
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </div>
                      </Link>
                    </TooltipTrigger>
                    {isCollapsed && <TooltipContent side="right">{project.name}</TooltipContent>}
                  </Tooltip>
                ))}
              </div>
            </div>
          </div>

          {/* 👇 --- SECCIÓN INFERIOR CON LÓGICA DE LAYOUT CORREGIDA --- 👇 */}
          <div className="mt-auto pt-4 border-t border-border/50">
            <div className={cn("flex flex-col items-center gap-2")}>
              <div className={cn(
                "flex items-center w-full",
                isCollapsed ? "flex-col gap-2" : "justify-between"
              )}>
                <div className={cn("flex items-center", isCollapsed ? "flex-col gap-2" : "gap-1")}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-full">
                        <Bell className="w-5 h-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">Notifications</TooltipContent>
                  </Tooltip>
                  <UserMenu />
                </div>
                {!isCollapsed && onToggle && (
                  <Button variant="ghost" size="icon" className="rounded-full" onClick={onToggle}>
                    <ChevronsLeft className="w-5 h-5" />
                  </Button>
                )}
              </div>
              {isCollapsed && onToggle && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="w-full rounded-xl" onClick={onToggle}>
                      <ChevronsLeft className="w-5 h-5 rotate-180" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Expand</TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>
        </div>
      </motion.aside>
    </TooltipProvider>
  )
}