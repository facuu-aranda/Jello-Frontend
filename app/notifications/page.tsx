"use client"

import * as React from "react"
import { Bell, CheckCheck } from "lucide-react"
import { useApi } from "@/hooks/useApi"
import { apiClient } from "@/lib/api"
import { Notification } from "@/types"
import { toast } from "sonner"
import { AppLayout } from "@/components/layout/app-layout"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { NotificationItem } from "@/components/notifications/NotificationItem"
import { NotificationDetailModal } from "@/components/modals/NotificationDetailModal"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, MessageSquareWarning } from "lucide-react";

interface PaginatedNotifications {
  notifications: Notification[];
  totalPages: number;
  currentPage: number;
}

export default function NotificationsPage() {
  const [page, setPage] = React.useState(1);
  const { data, isLoading, error, refetch } = useApi<PaginatedNotifications>(`/notifications?page=${page}&limit=10`);
  const [selectedNotification, setSelectedNotification] = React.useState<Notification | null>(null);
  const router = useRouter();

  const handleMarkAllAsRead = async () => {
    try {
    await apiClient.put("/notifications/read/all", {}); 
      toast.success("Todas las notificaciones han sido marcadas como leídas.");
      refetch();
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    // Siempre abre el modal, sin importar el tipo de notificación.
    setSelectedNotification(notification);

    // Si no está leída, la marca como leída en segundo plano.
    if (!notification.read) {
        try {
            await apiClient.put(`/notifications/${notification._id}/read`, {});
            refetch(); // Recarga los datos para actualizar el estado visual en la lista.
        } catch (err) {
            console.error("Failed to mark notification as read:", err);
            toast.error("Could not mark notification as read.");
        }
    }
};

  const unreadCount = data?.notifications?.filter((n) => !n.read).length || 0;

const handleMarkAsUnread = async (e: React.MouseEvent, notificationId: string) => {
    e.stopPropagation(); // Evita que se dispare el click del item principal
    try {
        await apiClient.put(`/notifications/${notificationId}/unread`, {});
        toast.success("Notification marked as unread.");
        refetch(); // Recarga los datos para reflejar el cambio
    } catch (err) {
        toast.error("Failed to mark as unread.");
    }
};

  return (
   <>
      <AppLayout>
        <div className="max-w-4xl mx-auto space-y-6 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                Notificaciones
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Tu historial completo de actividad y solicitudes.
              </p>
            </div>
            <Button
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0 || isLoading}
              className="w-full sm:w-auto"
            >
              <CheckCheck className="w-4 h-4 mr-2" />
              Marcar todo como leído
            </Button>
          </div>

          <div className="glass-card p-0 rounded-2xl overflow-hidden">
            <div className="space-y-0">
              {isLoading ? (
                <div className="space-y-2 p-4">
                  <Skeleton className="h-20 w-full rounded-lg" />
                  <Skeleton className="h-20 w-full rounded-lg" />
                  <Skeleton className="h-20 w-full rounded-lg" />
                </div>
              ) : error ? (
                (
                  <div className="text-center p-8 text-destructive">{error}</div>
                )
              ) : data && data.notifications.length > 0 ? (
                data.notifications.map((notification) => (
                  <NotificationItem
                    key={notification._id}
                    notification={notification}
                    onClick={() => handleNotificationClick(notification)}
                  />
                ))
              ) : (
                (
                  <div className="text-center p-12 text-muted-foreground">
                    <Bell className="mx-auto w-12 h-12 mb-4 opacity-50" />
                    <h3 className="font-semibold">Todo al día</h3>
                    <p>No tienes ninguna notificación.</p>
                  </div>
                )
              )}
            </div>
          </div>
          
          {/* Controles de Paginación */}
          {data && data.totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-6">
              <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                  disabled={isLoading || data.currentPage === 1}
              >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Anterior
              </Button>
              <span className="text-sm text-muted-foreground">
                  Página {data.currentPage} de {data.totalPages}
              </span>
              <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(prev => prev + 1)}
                  disabled={isLoading || data.currentPage === data.totalPages}
              >
                  Siguiente
                  <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </div>
      </AppLayout>
      <NotificationDetailModal
        isOpen={!!selectedNotification}
        onClose={() => setSelectedNotification(null)}
        notification={selectedNotification}
        onResponseSuccess={refetch}
      />
    </>
  )
}