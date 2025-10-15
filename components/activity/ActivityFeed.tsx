
"use client"

import * as React from 'react'
import { useApi } from '@/hooks/useApi'
import { Activity } from '@/types'
import { ActivityItem } from './ActivityItem'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertTriangle, List } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'

interface ActivityFeedProps {
  projectId: string;
}

export function ActivityFeed({ projectId }: ActivityFeedProps) {
  // Usamos el hook useApi para obtener la actividad específica de este proyecto
  const { data: activities, isLoading, error } = useApi<Activity[]>(`/projects/${projectId}/activity`);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-1/3" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 bg-muted/50 rounded-2xl">
        <AlertTriangle className="w-10 h-10 text-destructive mb-4" />
        <h3 className="text-lg font-semibold">Could not load activity</h3>
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold flex items-center gap-3">
        <List className="w-6 h-6" />
        Recent Activity
      </h2>
      {/* 2. Envolver la lista en ScrollArea y aplicar clases de altura */}
      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-2">
          {activities && activities.length > 0 ? (
            activities.map((activity, index) => (
              <ActivityItem key={activity.id} activity={activity} index={index} />
            ))
          ) : (
            <p className="text-muted-foreground p-4 text-center">No recent activity in this project.</p>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}