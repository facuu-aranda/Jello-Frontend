// ruta: app/notifications/page.tsx

"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Bell, CheckCheck } from "lucide-react"

import { useApi } from "@/hooks/useApi"
import { apiClient } from "@/lib/api"
import { Notification } from "@/types"
import { toast } from "sonner"

import { AppLayout } from "@/components/layout/app-layout"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { NotificationItem } from "@/components/notifications/NotificationItem"

export default function NotificationsPage() {
  // La misma lógica de fetching que en el panel
  const {
    data: notifications,
    isLoading,
    error,
    refetch,
  } = useApi<Notification[]>("/notifications")

  const handleMarkAllAsRead = async () => {
    try {
      await apiClient.put("/notifications/read", {})
      toast.success("Todas las notificaciones han sido marcadas como leídas.")
      refetch()
    } catch (err) {
      toast.error("No se pudieron marcar las notificaciones.")
    }
  }

  const unreadCount = notifications?.filter((n) => !n.read).length || 0

  return (
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

        <div className="glass-card p-2 sm:p-4 rounded-2xl">
          <div className="space-y-1">
            {isLoading ? (
              // Estado de Carga
              <div className="space-y-2 p-2">
                <Skeleton className="h-20 w-full rounded-lg" />
                <Skeleton className="h-20 w-full rounded-lg" />
                <Skeleton className="h-20 w-full rounded-lg" />
              </div>
            ) : error ? (
              // Estado de Error
              <div className="text-center p-8 text-destructive">{error}</div>
            ) : notifications && notifications.length > 0 ? (
              // Renderizado de la lista
              notifications.map((notification) => (
                <NotificationItem
                  key={notification._id}
                  notification={notification}
                  onUpdate={refetch}
                />
              ))
            ) : (
              // Estado Vacío
              <div className="text-center p-12 text-muted-foreground">
                <Bell className="mx-auto w-12 h-12 mb-4 opacity-50" />
                <h3 className="font-semibold">Todo al día</h3>
                <p>No tienes ninguna notificación.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}