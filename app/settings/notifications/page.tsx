"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Bell, Mail, MessageSquare, Calendar, Users } from "lucide-react"
import { SettingsLayout } from "@/components/settings/settings-layout"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { useApi } from "@/hooks/useApi"
import { UserSettings } from "@/types"
import { apiClient } from "@/lib/api"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"

type NotificationCategory = keyof UserSettings["notifications"];

export default function NotificationSettingsPage() {
  const { data: settings, isLoading, refetch } = useApi<UserSettings>('/user/me/settings');
  const [notifications, setNotifications] = useState<UserSettings['notifications'] | null>(null);

  useEffect(() => {
    if (settings) {
      setNotifications(settings.notifications);
    }
  }, [settings]);

  const updateSetting = (category: NotificationCategory, type: "email" | "push" | "inApp", value: boolean) => {
    setNotifications(prev => {
        if (!prev) return null;
        return {
            ...prev,
            [category]: {
                ...prev[category],
                [type]: value,
            }
        }
    });
  }
  
  const handleSaveChanges = async () => {
    toast.info("Saving notification settings...");
    try {
        await apiClient.put('/user/me/settings', { notifications });
        toast.success("Settings saved!");
        refetch();
    } catch(err) {
        toast.error((err as Error).message);
    }
  }

  const notificationTypes = [
    { id: "tasks", title: "Task Updates", description: "When tasks are assigned, completed, etc.", icon: MessageSquare },
    { id: "meetings", title: "Meeting Reminders", description: "For upcoming meetings and events", icon: Calendar },
    { id: "team", title: "Team Activity", description: "On team member activities and changes", icon: Users },
    { id: "mentions", title: "Mentions & Comments", description: "When someone mentions you", icon: Bell },
  ]

  if (isLoading || !notifications) {
    return <SettingsLayout><Skeleton className="w-full h-96" /></SettingsLayout>
  }

  return (
    <SettingsLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Notification Settings</h2>
          <p className="text-muted-foreground">Choose how you want to be notified</p>
        </div>
        <div className="space-y-6">
          {/* ... Table header remains the same ... */}
          {notificationTypes.map((setting) => (
            <motion.div
              key={setting.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-4 gap-4 items-center p-4 rounded-xl glass-card"
            >
              {/* ... Icon and description remain the same ... */}
              <div className="flex justify-center">
                <Checkbox
                  checked={notifications[setting.id as NotificationCategory]?.email}
                  onCheckedChange={(checked) => updateSetting(setting.id as NotificationCategory, "email", !!checked)}
                />
              </div>
              <div className="flex justify-center">
                 <Checkbox
                  checked={notifications[setting.id as NotificationCategory]?.push}
                  onCheckedChange={(checked) => updateSetting(setting.id as NotificationCategory, "push", !!checked)}
                />
              </div>
              <div className="flex justify-center">
                <Checkbox
                  checked={notifications[setting.id as NotificationCategory]?.inApp}
                  onCheckedChange={(checked) => updateSetting(setting.id as NotificationCategory, "inApp", !!checked)}
                />
              </div>
            </motion.div>
          ))}
        </div>
        <div className="flex gap-3 pt-6 border-t border-border">
          <Button onClick={handleSaveChanges} className="bg-primary hover:bg-primary-hover">Save Preferences</Button>
        </div>
      </div>
    </SettingsLayout>
  )
}
