"use client"

import { useState } from "react"
import { Camera, Save, User } from "lucide-react"
import { SettingsLayout } from "@/components/settings/settings-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export default function ProfileSettingsPage() {
  const [profile, setProfile] = useState({
    name: "Sarah Chen",
    email: "sarah.chen@example.com",
    title: "Product Manager",
    bio: "Passionate about building great products and leading amazing teams.",
    timezone: "Pacific Standard Time (PST)",
    language: "English",
  })

  const [isEditing, setIsEditing] = useState(false)

  const handleSave = () => {
    setIsEditing(false)
    // Save logic here
  }

  return (
    <SettingsLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Profile Settings</h2>
          <p className="text-muted-foreground">Manage your personal information and preferences</p>
        </div>

        {/* Profile Picture */}
        <div className="flex items-center gap-6">
          <div className="relative">
            <Avatar className="w-24 h-24 border-4 border-jello-blue/30">
              <img src="/sarah-avatar.png" alt="Profile" className="w-full h-full object-cover" />
            </Avatar>
            <Button
              size="sm"
              className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 bg-jello-blue hover:bg-jello-blue/90"
            >
              <Camera className="w-4 h-4" />
            </Button>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{profile.name}</h3>
            <p className="text-sm text-muted-foreground">{profile.title}</p>
            <Badge variant="secondary" className="mt-2">
              <User className="w-3 h-3 mr-1" />
              Team Member
            </Badge>
          </div>
        </div>

        {/* Profile Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
              <Input
                value={profile.name}
                onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
                disabled={!isEditing}
                className="bg-white/5 border-white/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
              <Input
                value={profile.email}
                onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))}
                disabled={!isEditing}
                className="bg-white/5 border-white/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Job Title</label>
              <Input
                value={profile.title}
                onChange={(e) => setProfile((prev) => ({ ...prev, title: e.target.value }))}
                disabled={!isEditing}
                className="bg-white/5 border-white/20"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Bio</label>
              <Textarea
                value={profile.bio}
                onChange={(e) => setProfile((prev) => ({ ...prev, bio: e.target.value }))}
                disabled={!isEditing}
                rows={4}
                className="bg-white/5 border-white/20 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Timezone</label>
              <Input
                value={profile.timezone}
                onChange={(e) => setProfile((prev) => ({ ...prev, timezone: e.target.value }))}
                disabled={!isEditing}
                className="bg-white/5 border-white/20"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-6 border-t border-white/10">
          {isEditing ? (
            <>
              <Button onClick={handleSave} className="bg-jello-blue hover:bg-jello-blue/90">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} variant="outline">
              Edit Profile
            </Button>
          )}
        </div>
      </div>
    </SettingsLayout>
  )
}
