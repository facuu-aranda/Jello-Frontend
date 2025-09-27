"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ActivityItem } from "@/components/activity/ActivityItem"
import { Button } from "@/components/ui/button"
// --- NUEVO: Imports necesarios ---
import { useApi } from "@/hooks/useApi"
import { Activity } from "@/types"
import { Skeleton } from "@/components/ui/skeleton"

export function RecentActivityWidget() {
  // --- NUEVO: Llamada a la API para obtener datos reales ---
  const { data: activities, isLoading } = useApi<Activity[]>('/activity/recent?limit=4');

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
        {/* --- MODIFICADO: Lógica para mostrar estado de carga o datos reales --- */}
        {isLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex items-center gap-3 p-4">
              <Skeleton className="w-8 h-8 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/4" />
              </div>
              <Skeleton className="w-8 h-8 rounded-full" />
            </div>
          ))
        ) : (
          activities?.map((activity, index) => (
            <ActivityItem key={activity.id} activity={activity} index={index} />
          ))
        )}
      </div>
    </motion.div>
  )
}