// ruta: components/notifications/NotificationItem.tsx

"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"
import {
  UserPlus,
  Handshake,
  Check,
  X,
  MessageSquare,
  ClipboardCheck,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { apiClient } from "@/lib/api"
import { Notification } from "@/types"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface NotificationItemProps {
  notification: Notification
  onUpdate: () => void
}

const notificationConfig = {
  project_invitation: { icon: UserPlus, color: "text-blue-500" },
  collaboration_request: { icon: Handshake, color: "text-purple-500" },
  task_assignment: { icon: ClipboardCheck, color: "text-green-500" },
  new_comment: { icon: MessageSquare, color: "text-orange-500" },
  mention: { icon: UserPlus, color: "text-yellow-500" },
  default: { icon: UserPlus, color: "text-gray-500" },
}

const getNotificationLink = (notification: Notification): string => {
  // El backend debe enviar el ID de la tarea para que esto funcione
  const taskId = (notification as any).task;

  switch (notification.type) {
    case "task_assignment":
    case "new_comment":
    case "mention":
      return `/project/${notification.project._id}?task=${taskId}`
    case "project_invitation":
    case "collaboration_request":
      return `/project/${notification.project._id}`
    default:
      return "#"
  }
}

export function NotificationItem({ notification, onUpdate }: NotificationItemProps) {
  const [isResponding, setIsResponding] = React.useState(false)

  const config = notificationConfig[notification.type as keyof typeof notificationConfig] || notificationConfig.default
  const Icon = config.icon
  const href = getNotificationLink(notification)

  const handleResponse = async (e: React.MouseEvent, response: "accepted" | "declined") => {
    e.stopPropagation()
    e.preventDefault()

    setIsResponding(true)
    toast.info("Enviando respuesta...")

    try {
      await apiClient.put(`/notifications/${notification._id}/respond`, { response })
      toast.success(`La solicitud ha sido ${response === "accepted" ? "aceptada" : "rechazada"}.`)
      onUpdate()
    } catch (error) {
      toast.error((error as Error).message)
    } finally {
      setIsResponding(false)
    }
  }
  
  const renderContent = () => {
    const senderName = <span className="font-semibold">{notification.sender.name}</span>
    const projectName = <span className="font-semibold text-primary">{notification.project.name}</span>

    switch (notification.type) {
      case "project_invitation":
        return <>{senderName} te ha invitado a unirte al proyecto {projectName}.</>
      case "collaboration_request":
        return <>{senderName} quiere colaborar en tu proyecto {projectName}.</>
      case "task_assignment":
        return <>{senderName} te ha asignado una nueva tarea en {projectName}.</>
      case "new_comment":
        return <>{senderName} ha añadido un nuevo comentario en {projectName}.</>
      default:
        return <>{notification.message}</>
    }
  }

  return (
    <Link href={href} passHref legacyBehavior>
      <motion.a
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className={cn(
          "flex items-start gap-3 p-4 transition-colors duration-200 relative hover:bg-muted/60 cursor-pointer border-b border-border/50",
          !notification.read && "bg-primary/5",
        )}
      >
        {!notification.read && (
          <div className="absolute left-1 top-1/2 -translate-y-1/2 h-2 w-2 bg-primary rounded-full" />
        )}

        <div className="pl-3 pt-1">
          <Icon className={cn("w-5 h-5", config.color)} />
        </div>

        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-start gap-2">
            <Avatar className="w-8 h-8">
              <AvatarImage src={notification.sender.avatarUrl || undefined} />
              <AvatarFallback>{notification.sender.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm text-foreground">{renderContent()}</p>
              <p className="text-xs text-muted-foreground pt-1">
                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>

          {notification.status === "pending" && 
            (notification.type === "project_invitation" || notification.type === "collaboration_request") && (
            <div className="flex gap-2 pt-1 pl-10">
              <Button size="sm" className="h-7 px-2" onClick={(e) => handleResponse(e, "accepted")} disabled={isResponding}>
                <Check className="w-3 h-3 mr-1" /> Aceptar
              </Button>
              <Button size="sm" variant="outline" className="h-7 px-2 bg-transparent" onClick={(e) => handleResponse(e, "declined")} disabled={isResponding}>
                <X className="w-3 h-3 mr-1" /> Rechazar
              </Button>
            </div>
          )}
        </div>
      </motion.a>
    </Link> // <-- CORRECCIÓN: Se cierra la etiqueta Link correctamente.
  )
}