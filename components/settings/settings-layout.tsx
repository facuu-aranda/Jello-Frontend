"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"
import { User, Bell, Palette, Plug, Shield, HelpCircle } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface SettingsLayoutProps {
  children: ReactNode
}

const settingsNavigation = [
  {
    name: "Notifications",
    href: "/settings/notifications",
    icon: Bell,
    description: "Configure how you receive updates",
  },
  {
    name: "Appearance",
    href: "/settings/appearance",
    icon: Palette,
    description: "Customize your theme and display preferences",
  },
  {
    name: "Integrations",
    href: "/settings/integrations",
    icon: Plug,
    description: "Connect with third-party services",
  },
  {
    name: "Privacy & Security",
    href: "/settings/privacy",
    icon: Shield,
    description: "Control your privacy and security settings",
  },
  {
    name: "Help & Support",
    href: "/settings/help",
    icon: HelpCircle,
    description: "Get help and contact support",
  },
]

export function SettingsLayout({ children }: SettingsLayoutProps) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-gradient-to-br from-jello-blue/5 to-jello-accent/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your account and customize your Jello experience</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Settings Navigation */}
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              {settingsNavigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link key={item.name} href={item.href}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        "flex items-start gap-3 p-4 rounded-xl transition-all duration-200",
                        "backdrop-blur-sm border border-white/20",
                        isActive
                          ? "bg-jello-blue text-white border-jello-blue/30"
                          : "bg-white/10 hover:bg-white/20 text-foreground",
                      )}
                    >
                      <item.icon
                        className={cn("w-5 h-5 mt-0.5 flex-shrink-0", isActive ? "text-white" : "text-jello-blue")}
                      />
                      <div className="min-w-0 flex-1">
                        <p className={cn("font-medium text-sm", isActive ? "text-white" : "text-foreground")}>
                          {item.name}
                        </p>
                        <p
                          className={cn(
                            "text-xs mt-1 leading-relaxed",
                            isActive ? "text-white/80" : "text-muted-foreground",
                          )}
                        >
                          {item.description}
                        </p>
                      </div>
                    </motion.div>
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8"
            >
              {children}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
