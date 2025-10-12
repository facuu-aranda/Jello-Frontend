// Jello-Frontend/components/notification-panel.tsx

"use client";

import * as React from "react";
import Link from "next/link";
import { useApi } from "@/hooks/useApi";
import { Notification } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { NotificationItem } from "@/components/notifications/NotificationItem";
import { Button } from "./ui/button";
import { NotificationDetailModal } from "./modals/NotificationDetailModal";
import { apiClient } from "@/lib/api";
import { BellOff, LoaderCircle } from "lucide-react";

export function NotificationPanel() {
 const { data, isLoading, error, setData, refetch } = useApi<{ notifications: Notification[] }>("/notifications?limit=10");


  const [selectedNotification, setSelectedNotification] = React.useState<Notification | null>(null);

  const unreadNotifications = React.useMemo(() => {
    return data?.notifications?.filter(n => !n.read) || [];
  }, [data]);

 const handleNotificationClick = (notification: Notification) => {
    // Actualización optimista: marcamos como leída en la UI inmediatamente
    setData(currentData => ({
      ...currentData,
      notifications: currentData?.notifications.map(n =>
        n._id === notification._id ? { ...n, read: true } : n
      ) || [],
    }));

    // Hacemos la llamada a la API en segundo plano
    apiClient.put(`/notifications/${notification._id}/read`, {}).catch(() => {
      refetch(); // Si falla, revertimos con datos del servidor
    });

    setSelectedNotification(notification);
  };

  return (
    <>
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-semibold text-foreground">Notificaciones</h3>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <LoaderCircle className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="text-center p-8 text-sm text-destructive">{error}</div>
          // 3. Verificamos si hay notificaciones no leídas para mostrar
          ) : unreadNotifications.length > 0 ? (
            unreadNotifications.map((notification) => (
              <NotificationItem
                key={notification._id}
                notification={notification}
                onClick={() => handleNotificationClick(notification)}
              />
            ))
          // 4. Mostramos el mensaje cuando no hay nada
          ) : (
            <div className="text-center p-8 text-muted-foreground">
              <BellOff className="mx-auto w-10 h-10 mb-2 opacity-50" />
              <h3 className="font-semibold text-sm">You're all caught up</h3>
              <p className="text-xs">You have no unread notifications.</p>
            </div>
          )}
        </div>

        <div className="p-2 border-t border-border">
          <Button variant="ghost" className="w-full text-sm" asChild>
            <Link href="/notifications">Ver todas las notificaciones</Link>
          </Button>
        </div>
      </div>

      <NotificationDetailModal
        isOpen={!!selectedNotification}
        onClose={() => setSelectedNotification(null)}
        notification={selectedNotification}
        onResponseSuccess={refetch} 
      />
    </>
  );
}