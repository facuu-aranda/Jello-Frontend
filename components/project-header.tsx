"use client"

import * as React from 'react';
import { ProjectDetails } from '@/types';
import { Users, Settings, UserPlus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';

interface ProjectHeaderProps {
  project: ProjectDetails;
  onEdit: () => void;
  onInviteMembers: () => void;
}

export function ProjectHeader({ project, onEdit, onInviteMembers }: ProjectHeaderProps) {

  return (
    <div className="relative flex flex-col p-6 pt-0">
      {/* Banner Image */}
      <div className="h-40 bg-muted rounded-2xl overflow-hidden -mx-6 -mt-0 mb-8 relative">
        <img 
          src={project.bannerImageUrl || "/placeholder.jpg"} 
          alt={`${project.name} banner`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Header Content */}
      <div className="flex flex-col  md:flex-row gap-4 md:items-end md:justify-between">
        {/* Left Side: Avatar, Title, Description, Members */}
        <div className="flex items-start gap-4">
           <Avatar className={cn("w-16 h-16 rounded-full border-4 border-background", !project.projectImageUrl && project.color)}>
            <AvatarImage src={project.projectImageUrl || undefined} className="rounded-full" />
            <AvatarFallback className="rounded-full text-2xl font-bold">
              {project.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-foreground">{project.name}</h1>
            <p className="text-muted-foreground max-w-xl">{project.description}</p>
            
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2 pt-2 cursor-pointer">
                    <div className="flex -space-x-2">
                      {project.members.slice(0, 5).map((member) => (
                        <Avatar key={member.id} className="w-8 h-8 border-2 border-background">
                          <AvatarImage src={member.avatarUrl || ''} alt={member.name} />
                          <AvatarFallback className="text-xs">{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      ))}
                      {project.members.length > 5 && (
                        <Avatar className="w-8 h-8 border-2 border-background">
                          <AvatarFallback className="text-xs">+{project.members.length - 5}</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {project.members.length} Members
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="p-2">
                  <div className="flex flex-col gap-2 text-sm">
                    <p className="font-semibold px-2">Project Members</p>
                    {project.members.map(member => (
                      <div key={member.id} className="flex items-center gap-2">
                         <Avatar className="w-6 h-6">
                          <AvatarImage src={member.avatarUrl || ''} alt={member.name} />
                          <AvatarFallback className="text-xs">{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{member.name}</span>
                      </div>
                    ))}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

          </div>
        </div>

        {/* Right Side: Action Buttons */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          <Button variant="outline" onClick={onInviteMembers}>
            <UserPlus className="w-4 h-4 mr-2" />
            Add People
          </Button>
          <Button variant="ghost" size="icon" onClick={onEdit} aria-label="Project settings">
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}