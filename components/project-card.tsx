"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Users, Calendar, CheckCircle, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { Project, ProjectMember } from "@/lib/api/types"

interface ProjectCardProps {
  project: Project;
  onEdit: () => void;
}

export function ProjectCard({ project, onEdit }: ProjectCardProps) {
  
  const handleActionClick = (e: React.MouseEvent, action: () => void) => {
    e.preventDefault();
    e.stopPropagation();
    action();
  };

  // Defensive check for members array
  const membersToShow = project.members?.slice(0, 4) || [];

  return (
    <TooltipProvider delayDuration={0}>
      <motion.div
        className="group relative"
        whileHover={{ scale: 1.02}}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* CORRECCIÓN: Se usa project._id para la navegación */}
        <Link href={`/project/${project._id}`} className="block">
          <div className="glass-card p-6 space-y-4 hover:shadow-xl transition-all duration-300 flex flex-col h-full">
            
            {/* Contenido Principal */}
            <div className="flex-grow space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn("w-4 h-4 rounded-full flex-shrink-0", project.color || 'bg-gray-400')} />
                  <div className="space-y-1">
                    <h3 className="font-semibold text-foreground break-all">{project.name}</h3>
                    {project.isOwner && (
                      <Badge variant="secondary" className="text-xs">Owner</Badge>
                    )}
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{project.progress || 0}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <motion.div
                    className={cn("h-2 rounded-full", project.color || 'bg-gray-400')}
                    initial={{ width: 0 }}
                    animate={{ width: `${project.progress || 0}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
              </div>
            </div>

            {/* Pie de la Tarjeta */}
            <div className="flex-shrink-0 pt-4 border-t border-border/50">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    <span>{project.completedTasks || 0}/{project.totalTasks || 0}</span>
                  </div>
                  {project.dueDate && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(project.dueDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{project.members?.length || 0}</span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex -space-x-2">
                  {/* CORRECCIÓN: Mostramos placeholders ya que la API no popula los datos del usuario aquí */}
                  {membersToShow.map((member) => (
                    <Avatar key={member._id} className="w-6 h-6 border-2 border-background">
                       <AvatarFallback className="text-xs">?</AvatarFallback>
                    </Avatar>
                  ))}
                  {(project.members?.length || 0) > 4 && (
                    <div className="w-6 h-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                      <span className="text-xs text-muted-foreground">+{project.members.length - 4}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Link>
        
        {/* Botón de Edición (Hover) */}
        <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 bg-background/50 hover:bg-background/80" onClick={(e) => handleActionClick(e, onEdit)}>
                <Edit className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Edit project</TooltipContent>
          </Tooltip>
        </div>
      </motion.div>
    </TooltipProvider>
  )
}