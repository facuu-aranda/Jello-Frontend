"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { MoreHorizontal, Users, Calendar, CheckCircle, Edit, Settings, Archive } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface ProjectCardProps {
  project: {
    id: string
    name: string
    description: string
    color: string
    progress: number
    totalTasks: number
    completedTasks: number
    members: Array<{
      id: string
      name: string
      avatar?: string
    }>
    dueDate?: string
    isOwner: boolean
  }
  onEdit?: () => void
}

export function ProjectCard({ project, onEdit }: ProjectCardProps) {
  return (
    <motion.div
      className="glass-card p-6 space-y-4 group hover:shadow-xl transition-all duration-300"
      whileHover={{ y: -2 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={cn("w-4 h-4 rounded-full", project.color)} />
          <div className="space-y-1">
            <Link href={`/project/${project.id}`}>
              <h3 className="font-semibold text-foreground hover:text-primary transition-colors cursor-pointer">
                {project.name}
              </h3>
            </Link>
            {project.isOwner && (
              <Badge variant="secondary" className="text-xs">
                Owner
              </Badge>
            )}
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Edit project
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              View settings
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Archive className="mr-2 h-4 w-4" />
              Archive
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium">{project.progress}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <motion.div
            className={cn("h-2 rounded-full", project.color)}
            initial={{ width: 0 }}
            animate={{ width: `${project.progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <CheckCircle className="w-4 h-4" />
            <span>
              {project.completedTasks}/{project.totalTasks}
            </span>
          </div>
          {project.dueDate && (
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{project.dueDate}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          <span>{project.members.length}</span>
        </div>
      </div>

      {/* Members */}
      <div className="flex items-center justify-between">
        <div className="flex -space-x-2">
          {project.members.slice(0, 4).map((member) => (
            <Avatar key={member.id} className="w-6 h-6 border-2 border-background">
              <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
              <AvatarFallback className="text-xs">{member.name.charAt(0)}</AvatarFallback>
            </Avatar>
          ))}
          {project.members.length > 4 && (
            <div className="w-6 h-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
              <span className="text-xs text-muted-foreground">+{project.members.length - 4}</span>
            </div>
          )}
        </div>

        <Link href={`/project/${project.id}`}>
          <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
            Open
          </Button>
        </Link>
      </div>
    </motion.div>
  )
}
