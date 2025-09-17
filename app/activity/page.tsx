// app/activity/page.tsx
"use client"

import * as React from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { ActivityItem } from "@/components/activity/ActivityItem"

const mockActivities = [
    { id: 1, type: "comment", user: { name: "Sarah", avatar: "/sarah-avatar.png" }, action: "commented on", target: "Update homepage design", time: "2 minutes ago", projectId: 1 },
    { id: 2, type: "completion", user: { name: "Mike", avatar: "/mike-avatar.jpg" }, action: "completed", target: "Fix login bug", time: "1 hour ago", projectId: 2 },
    { id: 3, type: "join", user: { name: "Alex", avatar: "/diverse-user-avatars.png" }, action: "joined project", target: "Mobile App", time: "3 hours ago", projectId: 2 },
    { id: 4, type: "document", user: { name: "You", avatar: "/diverse-user-avatars.png" }, action: "uploaded", target: "API Documentation.pdf", time: "Yesterday", projectId: 1 },
    { id: 5, type: "completion", user: { name: "Sarah", avatar: "/sarah-avatar.png" }, action: "completed", target: "Create user personas", time: "2 days ago", projectId: 1 },
];

export default function ActivityPage() {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Recent Activity</h1>
          <p className="text-muted-foreground">A log of all recent events across your projects.</p>
        </div>
        <div className="glass-card p-4 rounded-2xl space-y-2">
          {mockActivities.map((activity, index) => (
            <ActivityItem key={activity.id} activity={activity} index={index} />
          ))}
        </div>
      </div>
    </AppLayout>
  )
}