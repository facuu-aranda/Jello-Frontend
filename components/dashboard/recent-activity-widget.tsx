"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ActivityItem } from "@/components/activity/ActivityItem"
import { Button } from "@/components/ui/button"
import { Activity } from "@/lib/api/types"

interface RecentActivityWidgetProps {
  activities: Activity[];
}

export function RecentActivityWidget({ activities }: RecentActivityWidgetProps) {
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