"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Home, FolderKanban, CheckSquare, Settings, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Projects", href: "/projects", icon: FolderKanban },
  { name: "My Tasks", href: "/tasks", icon: CheckSquare },
  { name: "Personal Todo", href: "/todos", icon: CheckSquare },
]

const projects = [
  { id: 1, name: "Website Redesign", color: "bg-accent-pink", members: 4 },
  { id: 2, name: "Mobile App", color: "bg-accent-purple", members: 6 },
  { id: 3, name: "Marketing Campaign", color: "bg-accent-teal", members: 3 },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <motion.aside
      className="w-64 h-screen glass-card rounded-r-3xl border-r border-glass-border"
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="flex flex-col h-full p-6">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <Avatar className="w-8 h-8">
            <AvatarImage src="/images/jelli-avatar.png" alt="Jello" />
            <AvatarFallback>J</AvatarFallback>
          </Avatar>
          <span className="text-xl font-bold text-foreground">Jello</span>
        </div>

        {/* Main Navigation */}
        <nav className="space-y-2 mb-8">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.name} href={item.href}>
                <motion.div
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent",
                  )}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </motion.div>
              </Link>
            )
          })}
        </nav>

        {/* Projects Section */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">Projects</h3>
            <Button size="icon" variant="ghost" className="w-6 h-6">
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-2">
            {projects.map((project) => (
              <Link key={project.id} href={`/project/${project.id}`}>
                <motion.div
                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm hover:bg-accent transition-colors"
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <div className={cn("w-3 h-3 rounded-full", project.color)} />
                  <span className="flex-1 text-foreground font-medium">{project.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {project.members}
                  </Badge>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="space-y-2 pt-4 border-t border-border">
          <Link href="/settings">
            <motion.div
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Settings className="w-4 h-4" />
              Settings
            </motion.div>
          </Link>
        </div>
      </div>
    </motion.aside>
  )
}
