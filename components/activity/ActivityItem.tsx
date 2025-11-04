"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { MessageSquare, CheckCircle, UserPlus, FileText } from "lucide-react"
import { formatDistanceToNow } from 'date-fns'


const activityConfig = {
  comment: { icon: MessageSquare, color: "text-blue-500" },
  completion: { icon: CheckCircle, color: "text-green-500" },
  join: { icon: UserPlus, color: "text-purple-500" },
  document: { icon: FileText, color: "text-orange-500" },
}

export function ActivityItem({ activity, index }: { activity: any, index: number }) {
  const config = activityConfig[activity.type as keyof typeof activityConfig] || activityConfig.comment;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link href={`/project/${activity.projectId || 1}`}>
        <div className="flex items-start gap-3 p-4 rounded-xl hover:bg-muted transition-colors  min-w-0">
          <div className="w-8 h-8 rounded-full bg-muted flex-shrink-0 flex items-center justify-center">
            <Icon className={`w-4 h-4 ${config.color}`} />
          </div>
          
          <div className="flex-1 min-w-0 space-y-1">
            <p className="text-sm text-foreground truncate">
              <span className="font-semibold truncate">{activity.user.name}</span> {activity.action}{" "}
              <span className="font-semibold text-primary truncate">"{activity.target}"</span>
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(activity.time), { addSuffix: true })}
            </p>
          </div>

          <Avatar className="w-8 h-8">
            <AvatarImage src={activity.user.avatar} />
            <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
      </Link>
    </motion.div>
  )
}