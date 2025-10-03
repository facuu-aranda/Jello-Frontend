"use client"

import * as React from 'react';
import { ProjectDetails } from '@/types';
import { Users, Calendar, CheckCircle } from 'lucide-react';

interface ProjectHeaderProps {
  project: ProjectDetails;
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
  const totalTasks = Object.values(project.tasksByStatus).flat().length;
  const completedTasks = project.tasksByStatus.done.length;

  return (
    <div className="p-6 border-b border-border/50">
      <h1 className="text-3xl font-bold text-foreground">{project.name}</h1>
      <p className="mt-2 text-muted-foreground max-w-3xl">{project.description}</p>
      <div className="flex items-center gap-6 mt-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span>{project.members.length} Members</span>
        </div>
        <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>{completedTasks} / {totalTasks} Tasks</span>
        </div>
        {project.dueDate && (
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>Due on {new Date(project.dueDate).toLocaleDateString()}</span>
          </div>
        )}
      </div>
    </div>
  );
}