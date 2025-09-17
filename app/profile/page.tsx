"use client"

import * as React from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { SkillsEditor } from "@/components/profile/SkillsEditor"
import { ImageUploadField } from "@/components/forms/image-upload-field"
import { Edit, Save } from "lucide-react"

const userProfile = {
  name: "John Doe",
  email: "john@example.com",
  title: "Lead Frontend Developer",
  timezone: "Pacific Standard Time (PST)",
  bio: "Passionate developer focused on creating beautiful and functional user experiences with React and Next.js.",
  avatar: "/diverse-user-avatars.png",
  banner: "/placeholder.jpg",
  skills: ["TypeScript", "React", "Next.js", "Tailwind CSS", "Teamwork"],
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = React.useState(false)
  const [profileData, setProfileData] = React.useState(userProfile)
  const [newAvatar, setNewAvatar] = React.useState<File | null>(null)
  const [newBanner, setNewBanner] = React.useState<File | null>(null)

  const handleSave = () => {
    console.log("Saving profile data:", { ...profileData, newAvatar, newBanner });
    setIsEditing(false);
  }

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-8 pb-12">
        <div className="relative">
          <div className="h-48 bg-muted rounded-2xl overflow-hidden relative">
            <img src={profileData.banner} alt="Banner" className="w-full h-full object-cover" />
            {isEditing && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <ImageUploadField label="Banner" name="bannerImage" onChange={setNewBanner} />
              </div>
            )}
          </div>
          <div className="absolute -bottom-12 left-8">
            <div className="relative">
              <Avatar className="w-24 h-24 rounded-full border-4 border-background">
                <AvatarImage src={profileData.avatar} />
                <AvatarFallback className="text-3xl">{profileData.name.charAt(0)}</AvatarFallback>
              </Avatar>
              {isEditing && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                   <ImageUploadField label="Avatar" name="avatarImage" onChange={setNewAvatar} />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="pt-14 px-8 flex justify-between items-start">
          <div className="space-y-1">
            {isEditing ? (
              <Input 
                className="text-3xl font-bold h-auto p-0 border-none focus-visible:ring-0" 
                value={profileData.name} 
                onChange={(e) => setProfileData({...profileData, name: e.target.value})} 
              />
            ) : (
              <h1 className="text-3xl font-bold">{profileData.name}</h1>
            )}
             {isEditing ? (
              <Input 
                className="text-muted-foreground p-0 h-auto border-none focus-visible:ring-0" 
                value={profileData.email} 
                onChange={(e) => setProfileData({...profileData, email: e.target.value})} 
              />
            ) : (
              <p className="text-muted-foreground">{profileData.email}</p>
            )}
          </div>
          {isEditing ? (
            <Button onClick={handleSave}><Save className="w-4 h-4 mr-2" />Save Changes</Button>
          ) : (
            <Button variant="outline" onClick={() => setIsEditing(true)}><Edit className="w-4 h-4 mr-2" />Edit Profile</Button>
          )}
        </div>

        <div className="p-8 grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="glass-card p-6 rounded-2xl">
              <h3 className="text-lg font-semibold mb-4">About</h3>
              {isEditing ? (
                <Textarea 
                  value={profileData.bio} 
                  onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                  className="min-h-[120px]"
                />
              ) : (
                <p className="text-muted-foreground">{profileData.bio}</p>
              )}
            </div>
            <div className="glass-card p-6 rounded-2xl">
              <h3 className="text-lg font-semibold mb-4">My Projects</h3>
              <p className="text-sm text-muted-foreground">Project list will be displayed here.</p>
            </div>
          </div>
          <div className="md:col-span-1 space-y-6">
            <div className="glass-card p-6 rounded-2xl space-y-4">
              <div>
                <Label>Job Title</Label>
                {isEditing ? <Input value={profileData.title} onChange={(e) => setProfileData({...profileData, title: e.target.value})} /> : <p className="text-sm">{profileData.title}</p>}
              </div>
              <div>
                <Label>Timezone</Label>
                {isEditing ? <Input value={profileData.timezone} onChange={(e) => setProfileData({...profileData, timezone: e.target.value})} /> : <p className="text-sm">{profileData.timezone}</p>}
              </div>
            </div>
            <div className="glass-card p-6 rounded-2xl">
              <h3 className="text-lg font-semibold mb-4">Skills</h3>
              <SkillsEditor 
                selectedSkills={profileData.skills}
                setSelectedSkills={(skills) => setProfileData({...profileData, skills})}
                isEditing={isEditing}
              />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}