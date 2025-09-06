"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plug, Check, ExternalLink, Settings } from "lucide-react"
import { SettingsLayout } from "@/components/settings/settings-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Integration {
  id: string
  name: string
  description: string
  icon: string
  connected: boolean
  category: "productivity" | "communication" | "storage" | "development"
}

export default function IntegrationsSettingsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: "slack",
      name: "Slack",
      description: "Get notifications and updates in your Slack channels",
      icon: "💬",
      connected: true,
      category: "communication",
    },
    {
      id: "google-drive",
      name: "Google Drive",
      description: "Attach files from Google Drive to your tasks",
      icon: "📁",
      connected: true,
      category: "storage",
    },
    {
      id: "github",
      name: "GitHub",
      description: "Link commits and pull requests to your projects",
      icon: "🐙",
      connected: false,
      category: "development",
    },
    {
      id: "figma",
      name: "Figma",
      description: "Embed design files and prototypes in your tasks",
      icon: "🎨",
      connected: false,
      category: "productivity",
    },
    {
      id: "zoom",
      name: "Zoom",
      description: "Schedule and join meetings directly from Jello",
      icon: "📹",
      connected: true,
      category: "communication",
    },
    {
      id: "notion",
      name: "Notion",
      description: "Sync your Notion pages with Jello projects",
      icon: "📝",
      connected: false,
      category: "productivity",
    },
  ])

  const toggleIntegration = (id: string) => {
    setIntegrations((prev) =>
      prev.map((integration) =>
        integration.id === id ? { ...integration, connected: !integration.connected } : integration,
      ),
    )
  }

  const categories = [
    { id: "all", name: "All Integrations" },
    { id: "productivity", name: "Productivity" },
    { id: "communication", name: "Communication" },
    { id: "storage", name: "Storage" },
    { id: "development", name: "Development" },
  ]

  const [selectedCategory, setSelectedCategory] = useState("all")

  const filteredIntegrations =
    selectedCategory === "all"
      ? integrations
      : integrations.filter((integration) => integration.category === selectedCategory)

  return (
    <SettingsLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Integrations</h2>
          <p className="text-muted-foreground">Connect Jello with your favorite tools and services</p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className={selectedCategory === category.id ? "bg-jello-blue hover:bg-jello-blue/90" : ""}
            >
              {category.name}
            </Button>
          ))}
        </div>

        {/* Integrations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredIntegrations.map((integration) => (
            <motion.div
              key={integration.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{integration.icon}</div>
                  <div>
                    <h3 className="font-semibold text-foreground">{integration.name}</h3>
                    <Badge
                      variant={integration.connected ? "default" : "secondary"}
                      className={integration.connected ? "bg-green-500 hover:bg-green-600" : ""}
                    >
                      {integration.connected ? (
                        <>
                          <Check className="w-3 h-3 mr-1" />
                          Connected
                        </>
                      ) : (
                        <>
                          <Plug className="w-3 h-3 mr-1" />
                          Not Connected
                        </>
                      )}
                    </Badge>
                  </div>
                </div>
                {integration.connected && (
                  <Button variant="ghost" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                )}
              </div>

              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{integration.description}</p>

              <div className="flex gap-2">
                <Button
                  onClick={() => toggleIntegration(integration.id)}
                  variant={integration.connected ? "outline" : "default"}
                  size="sm"
                  className={!integration.connected ? "bg-jello-blue hover:bg-jello-blue/90" : ""}
                >
                  {integration.connected ? "Disconnect" : "Connect"}
                </Button>
                <Button variant="ghost" size="sm">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredIntegrations.length === 0 && (
          <div className="text-center py-12">
            <Plug className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No integrations found</h3>
            <p className="text-muted-foreground">Try selecting a different category</p>
          </div>
        )}
      </div>
    </SettingsLayout>
  )
}
