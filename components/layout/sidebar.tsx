"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { Home, FolderKanban, CheckSquare, Settings, Plus, ChevronsLeft, ChevronsRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
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
  onToggle: () => void
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname()

  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside
        animate={{ width: isCollapsed ? "5rem" : "16rem" }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="fixed top-0 left-0 h-full glass-card rounded-r-3xl border-r border-glass-border flex flex-col z-20"
      >
        <div className="flex flex-col h-full p-3">
          {/* Logo */}
          <div className={cn("flex items-center gap-3 mb-8", isCollapsed ? "justify-center" : "px-3")}>
            <Avatar className="w-8 h-8">
              <AvatarImage src="/images/jelli-avatar.png" alt="Jello" />
              <AvatarFallback>J</AvatarFallback>
            </Avatar>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="text-xl font-bold text-foreground whitespace-nowrap"
                >
                  Jello
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* Main Navigation */}
          <nav className="space-y-2 mb-8">
            {navigation.map((item) => {
              const isActive = pathname.startsWith(item.href)
              return (
                <Tooltip key={item.name}>
                  <TooltipTrigger asChild>
                    <Link href={item.href}>
                      <div
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors mb-1",
                          isActive
                            ? "bg-primary text-primary-foreground shadow-md"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent",
                          isCollapsed && "justify-center",
                        )}
                      >
                        <item.icon className="w-5 h-5 shrink-0" />
                        <AnimatePresence>
                          {!isCollapsed && (
                            <motion.span
                              initial={{ opacity: 0, width: 0 }}
                              animate={{ opacity: 1, width: "auto" }}
                              exit={{ opacity: 0, width: 0 }}
                              transition={{ duration: 0.2 }}
                              className="whitespace-nowrap"
                            >
                              {item.name}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </div>
                    </Link>
                  </TooltipTrigger>
                  {isCollapsed && <TooltipContent side="right">{item.name}</TooltipContent>}
                </Tooltip>
              )
            })}
          </nav>

          {/* Projects Section */}
          <div className="flex-1 overflow-hidden">
            <div className={cn("flex items-center justify-between mb-4", isCollapsed ? "justify-center" : "px-3")}>
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.h3
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-sm font-semibold text-foreground whitespace-nowrap"
                  >
                    Projects
                  </motion.h3>
                )}
              </AnimatePresence>
              <Button size="icon" variant="ghost" className="w-6 h-6 shrink-0">
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-2">
              {projects.map((project) => (
                <Tooltip key={project.id}>
                  <TooltipTrigger asChild>
                    <Link href={`/project/${project.id}`}>
                      <div
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-xl text-sm hover:bg-accent transition-colors",
                          isCollapsed && "justify-center",
                        )}
                      >
                        <div className={cn("w-3 h-3 rounded-full shrink-0", project.color)} />
                        <AnimatePresence>
                          {!isCollapsed && (
                            <motion.span
                              initial={{ opacity: 0, width: 0 }}
                              animate={{ opacity: 1, width: "auto" }}
                              exit={{ opacity: 0, width: 0 }}
                              transition={{ duration: 0.2 }}
                              className="flex-1 text-foreground font-medium whitespace-nowrap overflow-hidden text-ellipsis"
                            >
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

          {/* Bottom Actions */}
          <div className="space-y-2 pt-4 border-t border-border">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/settings">
                  <div
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors",
                      isCollapsed && "justify-center",
                    )}
                  >
                    <Settings className="w-5 h-5 shrink-0" />
                    <AnimatePresence>
                      {!isCollapsed && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.2 }}
                          className="whitespace-nowrap"
                        >
                          Settings
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </Link>
              </TooltipTrigger>
              {isCollapsed && <TooltipContent side="right">Settings</TooltipContent>}
            </Tooltip>

            <Button
              variant="ghost"
              size="icon"
              className={cn("w-full h-auto py-2 rounded-xl", isCollapsed ? "justify-center" : "justify-start px-3")}
              onClick={onToggle}
            >
              {isCollapsed ? <ChevronsRight className="w-5 h-5" /> : <ChevronsLeft className="w-5 h-5 mr-3" />}
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="whitespace-nowrap text-sm"
                  >
                    Collapse
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          </div>
        </div>
      </motion.aside>
    </TooltipProvider>
  )
}