"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { MessageSquare, CheckCircle, UserPlus, FileText } from "lucide-react"
import { Activity } from "@/lib/api/types" // Importamos el tipo

const activityConfig = {
  comment: { icon: MessageSquare, color: "text-blue-500" },
  completion: { icon: CheckCircle, color: "text-green-500" },
  join: { icon: UserPlus, color: "text-purple-500" },
  document: { icon: FileText, color: "text-orange-500" },
  default: { icon: MessageSquare, color: "text-gray-500" }, // Añadimos un default
}

export function ActivityItem({ activity, index }: { activity: Activity, index: number }) {
  // Usamos 'default' si el tipo no se encuentra
  const config = activityConfig[activity.type as keyof typeof activityConfig] || activityConfig.default;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link href={`/project/${activity.projectId || 1}`}>
        <div className="flex items-start gap-3 p-4 rounded-xl hover:bg-muted transition-colors">
          <div className="w-8 h-8 rounded-full bg-muted flex-shrink-0 flex items-center justify-center">
            <Icon className={`w-4 h-4 ${config.color}`} />
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-sm text-foreground">
              <span className="font-semibold">{activity.user?.name || 'Someone'}</span> {activity.action}{" "}
              <span className="font-semibold text-primary">{activity.target}</span>
            </p>
            <p className="text-xs text-muted-foreground">{activity.time}</p>
          </div>
          {/* --- INICIO DE LA CORRECCIÓN --- */}
          {activity.user && (
            <Avatar className="w-8 h-8">
              <AvatarImage src={activity.user.avatar} />
              <AvatarFallback>
                {activity.user.name ? activity.user.name.charAt(0) : '?'}
              </AvatarFallback>
            </Avatar>
          )}
          {/* --- FIN DE LA CORRECCIÓN --- */}
        </div>
      </Link>
    </motion.div>
  )
}