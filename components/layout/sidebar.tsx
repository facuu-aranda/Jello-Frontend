"use client"
import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/contexts/auth-context"
import { useApi } from "@/hooks/useApi"
import { ProjectSummary } from "@/types"
import { cn } from "@/lib/utils"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { CreateProjectModal } from "@/components/modals/create-project-modal"
import { Home, FolderKanban, CheckSquare, Search, Plus, ChevronsLeft, Bell, ClipboardList } from "lucide-react"
import { apiClient } from "@/lib/api"
import { toast } from "sonner"
import { useTranslations } from "next-intl" // <-- 1. Importamos el hook de traducciones.

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  isMobileView?: boolean;
}

export function Sidebar({ isCollapsed, onToggle, isMobileView = false }: SidebarProps) {
  const t = useTranslations('Sidebar'); // <-- 2. Inicializamos el hook con el namespace 'Sidebar'.
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const { data: projects, isLoading, refetch } = useApi<ProjectSummary[]>('/projects/summary');
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);

  // <-- 3. Reemplazamos los nombres estáticos con las traducciones.
  const navigation = [
    { name: t('dashboard'), href: "/dashboard", icon: Home },
    { name: t('search'), href: "/search", icon: Search },
    { name: t('projects'), href: "/projects", icon: FolderKanban },
    { name: t('myTasks'), href: "/tasks", icon: CheckSquare },
    { name: t('todos'), href: "/todos", icon: ClipboardList },
  ];

  const handleCreateProject = async (formData: FormData) => {
    toast.info("Creating new project...");
    try {
      const newProject = await apiClient.post<ProjectSummary>('/projects', formData);
      toast.success(`Project "${newProject.name}" created!`);
      await refetch();
      setIsCreateModalOpen(false);
      router.push(`/project/${newProject.id}`);
    } catch (err) {
      toast.error(`Failed to create project: ${(err as Error).message}`);
    }
  };
  
  // El resto de la lógica del componente permanece igual.
  return (
    <>
      <TooltipProvider delayDuration={0}>
        <motion.aside
          className={cn(
            "z-40 bg-card/80 backdrop-blur-sm border-r border-border/50 flex-shrink-0 transition-[width] duration-300 ease-in-out",
            isMobileView ? "fixed inset-y-0 left-0" : "relative",
            isCollapsed ? "w-20" : "w-64"
          )}
          initial={false}
          animate={{ width: isCollapsed ? 80 : 256 }}
        >
          <div className="flex flex-col h-full p-3">
            <div className={cn("flex items-center gap-3 mb-4", isCollapsed ? "justify-center" : "justify-between px-2")}>
              {!isCollapsed && (
                <Link href="/dashboard" className="flex items-center gap-2">
                  <img src="/logo.svg" alt="Jello Logo" className="w-8 h-8" />
                  <span className="font-bold text-lg">Jello</span>
                </Link>
              )}
              <Button variant="ghost" size="icon" onClick={onToggle} className="h-8 w-8">
                <ChevronsLeft className={cn("w-5 h-5 transition-transform", isCollapsed && "rotate-180")} />
              </Button>
            </div>

            <div className="flex-grow overflow-y-auto space-y-4">
              <nav className="space-y-1 px-2">
                {navigation.map((item) => (
                  <Tooltip key={item.name} delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Link href={item.href} className={cn(
                        "flex items-center gap-4 rounded-lg transition-colors",
                        pathname === item.href ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                        isCollapsed ? "justify-center p-3" : "p-2"
                      )}>
                        <item.icon className="h-5 w-5" />
                        <AnimatePresence>
                          {!isCollapsed && (
                            <motion.span initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }} transition={{ duration: 0.2 }} className="whitespace-nowrap font-medium text-sm">
                              {item.name}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </Link>
                    </TooltipTrigger>
                    {isCollapsed && <TooltipContent side="right">{item.name}</TooltipContent>}
                  </Tooltip>
                ))}
              </nav>

              <div className="px-2">
                <div className={cn("mb-2 flex items-center", isCollapsed ? "justify-center" : "justify-between")}>
                  {!isCollapsed && (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs font-semibold text-muted-foreground uppercase pl-2">
                      {t('projects')} 
                    </motion.span> // <-- 4. Traducción del título de la sección.
                  )}
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Button variant={isCollapsed ? "ghost" : "outline"} size="icon" className={cn("transition-all", isCollapsed ? "w-10 h-10" : "w-auto h-8 px-2 py-1 text-xs")} onClick={() => setIsCreateModalOpen(true)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    {isCollapsed && <TooltipContent side="right">{t('createProject')}</TooltipContent>} 
                  </Tooltip>
                </div>
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                ) : (
                  <div className="space-y-1">
                    {projects?.slice(0, 5).map(project => (
                      <Tooltip key={project.id} delayDuration={0}>
                        <TooltipTrigger asChild>
                           <Link href={`/project/${project.id}`} className={cn(
                             "flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground rounded-lg transition-colors",
                             isCollapsed ? "justify-center p-3" : "p-2"
                           )}>
                            <span className={cn("w-3 h-3 rounded-full", project.color)} />
                            {!isCollapsed && <span className="truncate flex-1">{project.name}</span>}
                           </Link>
                        </TooltipTrigger>
                        {isCollapsed && <TooltipContent side="right">{project.name}</TooltipContent>}
                      </Tooltip>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-border mt-4 p-2 flex items-center gap-3">
              {user && (
                <Link href="/profile" className="flex items-center gap-3 w-full">
                  <Avatar className="w-9 h-9">
                    <AvatarImage src={user.avatarUrl || ''} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {!isCollapsed && (
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                  )}
                </Link>
              )}
            </div>
          </div>
        </motion.aside>
      </TooltipProvider>

      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={(data) => console.log("Creating project:", data)}
      />
    </>
  )
}