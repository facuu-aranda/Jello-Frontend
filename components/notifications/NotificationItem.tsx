// Jello-Frontend/components/notifications/NotificationItem.tsx

"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { formatDistanceToNow } from "date-fns"
import { UserPlus, Handshake, ClipboardCheck, MessageSquare, Bell, FilePlus, Shuffle, Check, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Notification } from "@/types"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

interface NotificationItemProps {
  notification: Notification
  onClick: () => void;
}

// --- MODIFICADO: Se añaden los nuevos tipos de notificación con sus estilos ---
const notificationConfig = {
  project_invitation: { icon: UserPlus, color: "text-blue-500" },
  collaboration_request: { icon: Handshake, color: "text-purple-500" },
  task_created: { icon: FilePlus, color: "text-gray-500" },
  task_assigned: { icon: ClipboardCheck, color: "text-green-500" },
  task_status_changed: { icon: Shuffle, color: "text-yellow-500" },
  new_comment: { icon: MessageSquare, color: "text-orange-500" },
  invitation_accepted: { icon: Check, color: "text-green-500" },
  invitation_declined: { icon: X, color: "text-red-500" },
  collaboration_accepted: { icon: Check, color: "text-green-500" },
  collaboration_declined: { icon: X, color: "text-red-500" },
  generic: { icon: Bell, color: "text-gray-500" },
};

export function NotificationItem({ notification, onClick }: NotificationItemProps) {
  const config = notificationConfig[notification.type as keyof typeof notificationConfig] || notificationConfig.generic;
  const Icon = config.icon;

  return (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      onClick={onClick}
      className={cn(
        "w-full flex items-start gap-3 p-4 text-left transition-colors duration-200 relative hover:bg-muted/60 cursor-pointer border-b border-border/50",
        !notification.read && "bg-primary/5",
      )}
    >
      {!notification.read && (
        <div className="absolute left-1.5 top-1/2 -translate-y-1/2 h-2 w-2 bg-primary rounded-full" />
      )}

      <div className="pl-4 pt-1">
        <Icon className={cn("w-5 h-5", config.color)} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={notification.sender.avatarUrl || undefined} />
            <AvatarFallback>{notification.sender.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            {/* Se usa `notification.text` en lugar de `message` */}
            <p className="text-sm text-foreground line-clamp-2">{notification.text}</p>
            <p className="text-xs text-muted-foreground pt-1">
              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>
      </div>
    </motion.button>
  )
}