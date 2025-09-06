"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Monitor, Moon, Sun, Zap } from "lucide-react"
import { SettingsLayout } from "@/components/settings/settings-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "@/contexts/theme-context"

export default function AppearanceSettingsPage() {
  const { theme, setTheme, toggleTheme } = useTheme()
  const [accentColor, setAccentColor] = useState("jello-blue")
  const [animations, setAnimations] = useState(true)

  const themes = [
    { id: "light", name: "Light", icon: Sun, description: "Clean and bright interface" },
    { id: "dark", name: "Dark", icon: Moon, description: "Easy on the eyes" },
    { id: "system", name: "System", icon: Monitor, description: "Matches your device settings" },
  ]

  const accentColors = [
    { id: "jello-blue", name: "Jello Blue", color: "#00a3e0" },
    { id: "emerald", name: "Emerald", color: "#10b981" },
    { id: "purple", name: "Purple", color: "#8b5cf6" },
    { id: "rose", name: "Rose", color: "#f43f5e" },
    { id: "amber", name: "Amber", color: "#f59e0b" },
  ]

  const handleThemeChange = (newTheme: string, event: React.MouseEvent) => {
    if (newTheme !== theme) {
      const rect = event.currentTarget.getBoundingClientRect()
      const x = rect.left + rect.width / 2
      const y = rect.top + rect.height / 2

      if (newTheme === "light" || newTheme === "dark") {
        toggleTheme({ x, y })
      } else {
        setTheme(newTheme)
      }
    }
  }

  return (
    <SettingsLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Appearance Settings</h2>
          <p className="text-muted-foreground">Customize how Jello looks and feels</p>
        </div>

        {/* Theme Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Theme</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {themes.map((themeOption) => (
              <motion.button
                key={themeOption.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => handleThemeChange(themeOption.id, e)}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  theme === themeOption.id ? "border-primary bg-primary/10" : "border-border bg-card hover:bg-muted"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className={`p-2 rounded-lg ${
                      theme === themeOption.id ? "bg-primary text-primary-foreground" : "bg-muted text-primary"
                    }`}
                  >
                    <themeOption.icon className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-foreground">{themeOption.name}</span>
                  {theme === themeOption.id && (
                    <Badge variant="secondary" className="ml-auto">
                      Active
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{themeOption.description}</p>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Accent Color */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Accent Color</h3>
          <div className="flex flex-wrap gap-3">
            {accentColors.map((color) => (
              <motion.button
                key={color.id}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setAccentColor(color.id)}
                className={`relative p-1 rounded-xl border-2 transition-all ${
                  accentColor === color.id ? "border-primary" : "border-border"
                }`}
              >
                <div className="w-12 h-12 rounded-lg" style={{ backgroundColor: color.color }} />
                {accentColor === color.id && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-4 h-4 bg-background rounded-full border-2 border-foreground" />
                  </div>
                )}
              </motion.button>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            Selected: <span className="font-medium">{accentColors.find((c) => c.id === accentColor)?.name}</span>
          </p>
        </div>

        {/* Animation Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Animations</h3>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setAnimations(!animations)}
            className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all w-full ${
              animations ? "border-primary bg-primary/10" : "border-border bg-card hover:bg-muted"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-lg ${animations ? "bg-primary text-primary-foreground" : "bg-muted text-primary"}`}
              >
                <Zap className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="font-medium text-foreground block">Enable Animations</span>
                <span className="text-sm text-muted-foreground">Smooth transitions and micro-interactions</span>
              </div>
            </div>
            {animations && <Badge variant="secondary">Enabled</Badge>}
          </motion.button>
        </div>

        <div className="flex gap-3 pt-6 border-t border-border">
          <Button className="bg-primary hover:bg-primary-hover">Save Changes</Button>
          <Button variant="outline">Reset to Defaults</Button>
        </div>
      </div>
    </SettingsLayout>
  )
}
