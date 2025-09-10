"use client"

import { motion } from "framer-motion"
import { MessageSquare, CheckCircle, UserPlus, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

const activities = [
  {
    id: 1,
    type: "comment",
    user: { name: "Sarah", avatar: "/sarah-avatar.png" },
    action: "commented on",
    target: "Update homepage design",
    time: "2 minutes ago",
    icon: MessageSquare,
  },
  {
    id: 2,
    type: "completion",
    user: { name: "Mike", avatar: "/mike-avatar.jpg" },
    action: "completed",
    target: "Fix login bug",
    time: "1 hour ago",
    icon: CheckCircle,
  },
  {
    id: 3,
    type: "join",
    user: { name: "Alex", avatar: "/diverse-user-avatars.png" },
    action: "joined project",
    target: "Mobile App",
    time: "3 hours ago",
    icon: UserPlus,
  },
  {
    id: 4,
    type: "document",
    user: { name: "You", avatar: "/diverse-user-avatars.png" },
    action: "uploaded",
    target: "API Documentation.pdf",
    time: "Yesterday",
    icon: FileText,
  },
]

const iconColors = {
  comment: "text-blue-500",
  completion: "text-green-500",
  join: "text-purple-500",
  document: "text-orange-500",
}

export function RecentActivityWidget() {
  return (
    <motion.div
      className="glass-card p-6 space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
          <p className="text-sm text-muted-foreground">Latest updates from your projects</p>
        </div>
        <Button variant="ghost" size="sm">
          View all
        </Button>
      </div>

      {/* Activity List */}
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            className="flex items-start gap-3 p-3 rounded-xl hover:bg-accent/50 transition-colors"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {/* Icon */}
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <activity.icon className={`w-4 h-4 ${iconColors[activity.type as keyof typeof iconColors]}`} />
            </div>

            {/* Content */}
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <Avatar className="w-5 h-5">
                  <AvatarImage src={activity.user.avatar || "/placeholder.svg"} alt={activity.user.name} />
                  <AvatarFallback className="text-xs">{activity.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <p className="text-sm text-foreground">
                  <span className="font-medium">{activity.user.name}</span> {activity.action}{" "}
                  <span className="font-medium">{activity.target}</span>
                </p>
              </div>
              <p className="text-xs text-muted-foreground">{activity.time}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
        <Button variant="outline" size="sm" className="flex-1 bg-transparent">
          Mark All Read
        </Button>
        <Button variant="outline" size="sm" className="flex-1 bg-transparent">
          Settings
        </Button>
      </div>
    </motion.div>
  )
}
