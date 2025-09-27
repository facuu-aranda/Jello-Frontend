"use client"
import { Check, X, Users, MessageSquare, Calendar } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useApi } from "@/hooks/useApi";
import { Activity } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { ActivityItem } from "@/components/activity/ActivityItem";


export function NotificationPanel() {
  
const { data: notifications, isLoading } = useApi<Activity[]>('/activity/recent');

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="font-semibold text-foreground">Notifications</h3>
        <Button variant="ghost" size="sm" className="text-xs">
          Mark all read
        </Button>
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
  {isLoading ? (
    <div className="p-4 space-y-4">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
    </div>
  ) : (
    notifications?.map((activity, index) => (
      // Usamos el ActivityItem que ya existe y está bien diseñado
      <ActivityItem key={activity.id} activity={activity} index={index} />
    ))
  )}
</div>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <Button variant="ghost" className="w-full text-sm">
          View all notifications
        </Button>
      </div>
    </div>
  )
}
