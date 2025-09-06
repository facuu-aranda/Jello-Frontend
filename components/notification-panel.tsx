"use client"
import { Check, X, Users, MessageSquare, Calendar } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

const notifications = [
  {
    id: 1,
    type: "invitation",
    title: "Project Invitation",
    message: "Sarah invited you to join 'Website Redesign' project",
    time: "2 minutes ago",
    avatar: "/sarah-avatar.png",
    icon: Users,
  },
  {
    id: 2,
    type: "comment",
    title: "New Comment",
    message: "Mike commented on 'Update homepage design' task",
    time: "1 hour ago",
    avatar: "/mike-avatar.jpg",
    icon: MessageSquare,
  },
  {
    id: 3,
    type: "reminder",
    title: "Task Due Soon",
    message: "Fix login bug is due tomorrow",
    time: "3 hours ago",
    icon: Calendar,
  },
]

export function NotificationPanel() {
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
        {notifications.map((notification, index) => (
          <motion.div
            key={notification.id}
            className="p-4 border-b border-border last:border-b-0 hover:bg-accent/50 transition-colors"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-start gap-3">
              {/* Avatar or Icon */}
              {notification.avatar ? (
                <Avatar className="w-8 h-8">
                  <AvatarImage src={notification.avatar || "/placeholder.svg"} alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <notification.icon className="w-4 h-4 text-primary" />
                </div>
              )}

              {/* Content */}
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">{notification.title}</p>
                  <span className="text-xs text-muted-foreground">{notification.time}</span>
                </div>
                <p className="text-sm text-muted-foreground">{notification.message}</p>

                {/* Actions for invitations */}
                {notification.type === "invitation" && (
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" className="h-7 text-xs">
                      <Check className="w-3 h-3 mr-1" />
                      Accept
                    </Button>
                    <Button variant="outline" size="sm" className="h-7 text-xs bg-transparent">
                      <X className="w-3 h-3 mr-1" />
                      Decline
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
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
