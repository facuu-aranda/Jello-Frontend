"use client"

import * as React from "react"
import { Check, X, Users, MessageSquare, Calendar } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/AuthContext"
import { api } from "@/lib/api/client"
import { Notification } from "@/lib/api/types" // Usamos nuestro tipo global

const iconMap = {
  invitation: Users,
  comment: MessageSquare,
  reminder: Calendar,
};

export function NotificationPanel() {
  const { token } = useAuth();
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchNotifications = async () => {
      if (!token) return;
      setIsLoading(true);
      try {
        const data = await api.get('/notifications', token);
        setNotifications(data);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotifications();
  }, [token]);

  const handleResponse = async (notificationId: string, response: 'accepted' | 'declined') => {
    if (!token) return;
    try {
      await api.put(`/notifications/${notificationId}/respond`, { response }, token);
      // Eliminamos la notificación de la lista para una respuesta visual inmediata
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error("Failed to respond to notification:", error);
    }
  };

  if (isLoading) {
    return <div className="p-4 text-center text-sm">Loading...</div>;
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="font-semibold text-foreground">Notifications</h3>
        <Button variant="ghost" size="sm" className="text-xs">
          Mark all read
        </Button>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">No new notifications.</p>
        ) : (
          notifications.map((notification, index) => {
            const Icon = iconMap[notification.type as keyof typeof iconMap] || Users;
            return (
              <motion.div
                key={notification.id}
                className="p-4 border-b border-border last:border-b-0 hover:bg-accent/50 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-start gap-3">
                    {notification.avatar ? (
                        <Avatar className="w-8 h-8"><AvatarImage src={notification.avatar} /><AvatarFallback>U</AvatarFallback></Avatar>
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center"><Icon className="w-4 h-4 text-primary" /></div>
                    )}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground">{notification.title}</p>
                      <span className="text-xs text-muted-foreground">{notification.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                    {notification.type === "invitation" && (
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" className="h-7 text-xs" onClick={() => handleResponse(notification.id, 'accepted')}>
                          <Check className="w-3 h-3 mr-1" /> Accept
                        </Button>
                        <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent" onClick={() => handleResponse(notification.id, 'declined')}>
                          <X className="w-3 h-3 mr-1" /> Decline
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })
        )}
      </div>

      <div className="p-4 border-t border-border">
        <Button variant="ghost" className="w-full text-sm">
          View all notifications
        </Button>
      </div>
    </div>
  )
}