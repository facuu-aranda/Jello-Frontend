// components/modals/NotificationDetailModal.tsx

"use client"

import * as React from "react"
import Link from "next/link"
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import {
  Check, X, Loader2, ArrowRight, MessageSquareWarning, UserPlus, MessageSquare,
  UserCheck, Bell
} from "lucide-react"
import { toast } from "sonner"
import { Notification } from "@/types"
import { apiClient } from "@/lib/api"

import { Dialog, DialogContent, DialogFooter, DialogHeader } from "@/components/ui/dialog"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

// Nota: Para que `formatDistanceToNow` funcione, necesitarás instalar date-fns:
// npm install date-fns

interface NotificationDetailModalProps {
  notification: Notification | null
  isOpen: boolean
  onClose: () => void
  onResponseSuccess: () => void
}

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'project_invitation':
    case 'collaboration_request':
      return <UserPlus className="w-5 h-5 text-blue-400" />;
    case 'new_comment':
      return <MessageSquare className="w-5 h-5 text-green-400" />;
    case 'task_assigned':
      return <UserCheck className="w-5 h-5 text-purple-400" />;
    default:
      return <Bell className="w-5 h-5 text-gray-400" />;
  }
};

export function NotificationDetailModal({
  notification,
  isOpen,
  onClose,
  onResponseSuccess,
}: NotificationDetailModalProps) {
  const [isResponding, setIsResponding] = React.useState(false);

  if (!notification) return null;

  const handleResponse = async (response: "accepted" | "declined") => {
    setIsResponding(true);
    try {
      await apiClient.put(`/notifications/${notification._id}/respond`, { response });
      toast.success(`La invitación ha sido ${response === 'accepted' ? 'aceptada' : 'rechazada'}.`);
      onResponseSuccess();
      onClose();
    } catch (error) {
      toast.error("No se pudo procesar la respuesta.");
    } finally {
      setIsResponding(false);
    }
  };

  const handleMarkAsUnread = async () => {
    try {
      await apiClient.put(`/notifications/${notification._id}/unread`, {});
      toast.success("Notificación marcada como no leída.");
      onResponseSuccess();
      onClose();
    } catch (err) {
      toast.error("No se pudo marcar como no leída.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card p-0 max-w-lg">
        <DialogHeader className="p-6 pb-4">
          <div className="flex items-center gap-4">
            <div className="bg-foreground/10 p-2 rounded-lg">
              {getNotificationIcon(notification.type)}
            </div>
            <div className="flex-grow">
              <p className="font-semibold text-foreground">
                {notification.sender.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {notification.createdAt && formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: es })}
              </p>
            </div>
          </div>
        </DialogHeader>
        
        <div className="px-6 pb-6 space-y-4">
          <p className="text-base text-foreground leading-relaxed">
            {notification.text}
          </p>
        </div>

        <Separator className="bg-white/10" />

        <DialogFooter className="p-4 bg-black/10 flex-col-reverse sm:flex-row sm:justify-end w-full gap-4">
          <div className="flex items-center gap-4 pt-2 sm:pt-0">
            <Button variant="outline" size="icon" onClick={handleMarkAsUnread} className=" text-muted-foreground">
              <MessageSquareWarning  />
            </Button>
          </div>
          
          {notification.status === 'pending' ? (
            <div className="flex gap-2 self-end">
              <Button variant="outline" onClick={() => handleResponse('declined')} disabled={isResponding}>
                <X className="mr-2 h-4 w-4" /> Rechazar
              </Button>
              <Button onClick={() => handleResponse('accepted')} disabled={isResponding} className="bg-primary hover:bg-primary/90">
                {isResponding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                Aceptar
              </Button>
            </div>
          ) : (
            <Button asChild className="self-end">
              <Link href={notification.link} onClick={onClose}>
                Ver Detalles <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}