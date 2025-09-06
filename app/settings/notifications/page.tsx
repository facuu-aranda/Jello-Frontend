"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Bell, Mail, MessageSquare, Calendar, Users } from "lucide-react"
import { SettingsLayout } from "@/components/settings/settings-layout"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"

interface NotificationSetting {
  id: string
  title: string
  description: string
  icon: any
  email: boolean
  push: boolean
  inApp: boolean
}

export default function NotificationSettingsPage() {
  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: "tasks",
      title: "Task Updates",
      description: "Get notified when tasks are assigned, completed, or updated",
      icon: MessageSquare,
      email: true,
      push: true,
      inApp: true,
    },
    {
      id: "meetings",
      title: "Meeting Reminders",
      description: "Receive reminders for upcoming meetings and events",
      icon: Calendar,
      email: true,
      push: false,
      inApp: true,
    },
    {
      id: "team",
      title: "Team Activity",
      description: "Stay updated on team member activities and project changes",
      icon: Users,
      email: false,
      push: true,
      inApp: true,
    },
    {
      id: "mentions",
      title: "Mentions & Comments",
      description: "Get notified when someone mentions you or comments on your work",
      icon: Bell,
      email: true,
      push: true,
      inApp: true,
    },
  ])

  const updateSetting = (id: string, type: "email" | "push" | "inApp", value: boolean) => {
    setSettings((prev) => prev.map((setting) => (setting.id === id ? { ...setting, [type]: value } : setting)))
  }

  return (
    <SettingsLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Notification Settings</h2>
          <p className="text-muted-foreground">Choose how you want to be notified about important updates</p>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-4 gap-4 pb-4 border-b border-white/10">
            <div className="col-span-1">
              <h3 className="font-medium text-foreground">Notification Type</h3>
            </div>
            <div className="text-center">
              <h3 className="font-medium text-foreground flex items-center justify-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </h3>
            </div>
            <div className="text-center">
              <h3 className="font-medium text-foreground flex items-center justify-center gap-2">
                <Bell className="w-4 h-4" />
                Push
              </h3>
            </div>
            <div className="text-center">
              <h3 className="font-medium text-foreground flex items-center justify-center gap-2">
                <MessageSquare className="w-4 h-4" />
                In-App
              </h3>
            </div>
          </div>

          {settings.map((setting) => (
            <motion.div
              key={setting.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-4 gap-4 items-center p-4 rounded-xl bg-white/5 border border-white/10"
            >
              <div className="col-span-1">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-jello-blue/20">
                    <setting.icon className="w-4 h-4 text-jello-blue" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{setting.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{setting.description}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <Checkbox
                  checked={setting.email}
                  onCheckedChange={(checked) => updateSetting(setting.id, "email", !!checked)}
                />
              </div>

              <div className="flex justify-center">
                <Checkbox
                  checked={setting.push}
                  onCheckedChange={(checked) => updateSetting(setting.id, "push", !!checked)}
                />
              </div>

              <div className="flex justify-center">
                <Checkbox
                  checked={setting.inApp}
                  onCheckedChange={(checked) => updateSetting(setting.id, "inApp", !!checked)}
                />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex gap-3 pt-6 border-t border-white/10">
          <Button className="bg-jello-blue hover:bg-jello-blue/90">Save Preferences</Button>
          <Button variant="outline">Reset to Defaults</Button>
        </div>
      </div>
    </SettingsLayout>
  )
}
