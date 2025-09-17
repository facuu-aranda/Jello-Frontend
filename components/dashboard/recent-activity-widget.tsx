"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ActivityItem } from "@/components/activity/ActivityItem"
import { Button } from "@/components/ui/button"

const activities = [
  { id: 1, type: "comment", user: { name: "Sarah", avatar: "/sarah-avatar.png" }, action: "commented on", target: "Update homepage design", time: "2 minutes ago", projectId: 1 },
  { id: 2, type: "completion", user: { name: "Mike", avatar: "/mike-avatar.jpg" }, action: "completed", target: "Fix login bug", time: "1 hour ago", projectId: 2 },
  { id: 3, type: "join", user: { name: "Alex", avatar: "/diverse-user-avatars.png" }, action: "joined project", target: "Mobile App", time: "3 hours ago", projectId: 2 },
  { id: 4, type: "document", user: { name: "You", avatar: "/diverse-user-avatars.png" }, action: "uploaded", target: "API Documentation.pdf", time: "Yesterday", projectId: 1 },
]

export function RecentActivityWidget() {
  return (
    <motion.div
      className="glass-card p-6 space-y-4 flex flex-col"
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
        <Button asChild variant="ghost" size="sm">
          <Link href="/activity">View all</Link>
        </Button>
      </div>

      <div className="flex-grow space-y-1 -mx-3">
        {activities.map((activity, index) => (
          <ActivityItem key={activity.id} activity={activity} index={index} />
        ))}
      </div>
    </motion.div>
  )
}