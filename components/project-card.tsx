"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ProjectSummary } from "@/types"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { SquarePen, CheckCircle, Calendar } from "lucide-react"

interface ProjectCardProps {
  project: ProjectSummary;
  onEdit: (project: ProjectSummary) => void;
}

export function ProjectCard({ project, onEdit }: ProjectCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "relative group flex flex-col justify-between rounded-2xl border p-5 shadow-sm transition-all duration-300 ease-in-out hover:shadow-lg ",
        "bg-card/60 text-card-foreground"
      )}
    >

      <div className="absolute top-4 right-4">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full h-8 w-8 bg-background/20 hover:bg-background/80"
          onClick={(e) => {
            e.preventDefault(); // Prevenir navegación al hacer clic en editar
            onEdit(project);
          }}
          aria-label="Edit project"
        >
          <SquarePen className="w-4 h-4" />
        </Button>
      </div>

      <Link href={`/project/${project.id}`} className="flex flex-col z-2 h-full">
        <div className="flex-grow">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h3 className="text-lg font-bold">{project.name}</h3>
              {project.isOwner && (
                <Badge variant="secondary" className="text-xs">Owner</Badge>
              )}
            </div>
          </div>
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2 h-[40px]">
            {project.description}
          </p>
        </div>

        <div className="mt-4">
          <div className="flex justify-between items-center mb-1 text-xs text-muted-foreground">
            <span>Progress</span>
            <span>{project.progress}%</span>
          </div>
          <Progress value={project.progress} className="h-2" />
        </div>

        <div className="mt-4 flex justify-between items-end">
          <div className="flex -space-x-2">
            {project.members.slice(0, 3).map((member) => (
              <Avatar key={member.id} className="w-6 h-6 border-2 border-background">
                <AvatarImage src={member.avatarUrl || ''} alt={member.name} />
                <AvatarFallback className="text-xs">{member.name.charAt(0)}</AvatarFallback>
              </Avatar>
            ))}
            {project.members.length > 3 && (
              <Avatar className="w-6 h-6 border-2 border-background">
                <AvatarFallback className="text-xs">+{project.members.length - 3}</AvatarFallback>
              </Avatar>
            )}
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              <span>{project.completedTasks}/{project.totalTasks}</span>
            </div>
            {project.dueDate && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{new Date(project.dueDate).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}