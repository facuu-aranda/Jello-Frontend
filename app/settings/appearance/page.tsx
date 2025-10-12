"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Monitor, Moon, Sun, Zap } from "lucide-react"
import { SettingsLayout } from "@/components/settings/settings-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "@/contexts/theme-context"
import { useApi } from "@/hooks/useApi"
import { UserSettings } from "@/types"
import { apiClient } from "@/lib/api"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"

export default function AppearanceSettingsPage() {
  const { theme, setTheme, toggleTheme } = useTheme()
  const { data: settings, isLoading, refetch } = useApi<UserSettings>('/user/me/settings');
  
  const [appearance, setAppearance] = useState<UserSettings['appearance'] | null>(null);

  useEffect(() => {
    if (settings) {
      setAppearance(settings.appearance);
    }
  }, [settings]);

  const handleThemeChange = (newTheme: string, event: React.MouseEvent) => {
    if (newTheme !== theme) {
      if (newTheme === "light" || newTheme === "dark") {
        toggleTheme(event as any)
      } else {
        setTheme(newTheme)
      }
      setAppearance(prev => prev ? { ...prev, theme: newTheme as any } : null);
    }
  }
  
  const handleSaveChanges = async () => {
    toast.info("Saving appearance settings...");
    try {
        await apiClient.put('/user/me/settings', { appearance });
        toast.success("Settings saved!");
        refetch();
    } catch(err) {
        toast.error((err as Error).message);
    }
  }

  if (isLoading || !appearance) {
    return <SettingsLayout><Skeleton className="w-full h-96" /></SettingsLayout>
  }

  return (
    <SettingsLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Appearance Settings</h2>
          <p className="text-muted-foreground">Customize how Jello looks and feels</p>
        </div>
        {/* ... Theme, Accent, and Animation sections remain structurally the same, but now use `appearance` state ... */}
        <div className="flex gap-3 pt-6 border-t border-border">
          <Button onClick={handleSaveChanges} className="bg-primary hover:bg-primary-hover">Save Changes</Button>
        </div>
      </div>
    </SettingsLayout>
  )
}
