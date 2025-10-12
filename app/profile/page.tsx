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
import { Skeleton } from "@/components/ui/skeleton"
import { Edit, Save, AlertTriangle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useApi } from "@/hooks/useApi"
import { UserProfile } from "@/types"
import { apiClient } from "@/lib/api"
import { toast } from "sonner"

export default function ProfilePage() {
  const { user: authUser, revalidateUser } = useAuth(); // Usamos revalidate para actualizar el user global
  const { data: profileData, isLoading, error, refetch } = useApi<UserProfile>(`/user/me`);
  
  const [isEditing, setIsEditing] = React.useState(false)
  const [formData, setFormData] = React.useState<Partial<UserProfile>>({});
  const [newAvatar, setNewAvatar] = React.useState<File | null>(null)
  const [newBanner, setNewBanner] = React.useState<File | null>(null)

  React.useEffect(() => {
    if (profileData) {
      setFormData(profileData);
    }
  }, [profileData]);

  const handleSave = async () => {
    setIsEditing(false);
    toast.info("Saving your profile...");
    
    try {
      // 1. Subir avatar si cambió
      if (newAvatar) {
        const avatarFormData = new FormData();
        avatarFormData.append('file', newAvatar);
        const uploadRes = await apiClient.post<{ url: string }>('/user/me/avatar', avatarFormData);
        setFormData(prev => ({ ...prev, avatarUrl: uploadRes.url }));
      }
      // 2. Subir banner si cambió
      if (newBanner) {
        const bannerFormData = new FormData();
        bannerFormData.append('file', newBanner);
        const uploadRes = await apiClient.post<{ url: string }>('/user/me/banner', bannerFormData);
        setFormData(prev => ({ ...prev, bannerUrl: uploadRes.url }));
      }
      
      // 3. Actualizar el resto de los datos del perfil
      await apiClient.put('/user/profile', formData);

      // 4. Refrescar los datos y notificar al usuario
      await revalidateUser(); // Actualiza el usuario en el AuthContext
      await refetch(); // Vuelve a cargar los datos en esta página
      toast.success("Profile updated successfully!");

    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setNewAvatar(null);
      setNewBanner(null);
    }
  };

  const handleCancel = () => {
    if (profileData) setFormData(profileData);
    setIsEditing(false);
  }

  const handleFieldChange = (field: keyof UserProfile, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }

  if (isLoading) {
    return <AppLayout><Skeleton className="w-full h-[600px] rounded-2xl" /></AppLayout>;
  }

  if (error || !formData) {
     return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-full text-center">
          <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
          <h2 className="text-2xl font-bold">Error Loading Profile</h2>
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={refetch} className="mt-6">Try Again</Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-8 pb-12">
        <div className="relative">
          <div className="h-48 bg-muted rounded-2xl overflow-hidden relative">
            <img src={newBanner ? URL.createObjectURL(newBanner) : formData.bannerUrl || "/placeholder.jpg"} alt="Banner" className="w-full h-full object-cover" />
            {isEditing && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <ImageUploadField label="Change Banner" name="bannerImage" onChange={setNewBanner} />
              </div>
            )}
          </div>
          <div className="absolute -bottom-12 left-8">
            <div className="relative">
              <Avatar className="w-24 h-24 rounded-full border-4 border-background">
                <AvatarImage src={newAvatar ? URL.createObjectURL(newAvatar) : formData.avatarUrl || undefined} />
                <AvatarFallback className="text-3xl">{formData.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              {isEditing && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                   <ImageUploadField label="Change Avatar" name="avatarImage" onChange={setNewAvatar} />
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
                value={formData.name || ''} 
                onChange={(e) => handleFieldChange('name', e.target.value)} 
              />
            ) : (
              <h1 className="text-3xl font-bold">{formData.name}</h1>
            )}
             {isEditing ? (
              <Input 
                className="text-muted-foreground p-0 h-auto border-none focus-visible:ring-0" 
                value={formData.email || ''} 
                onChange={(e) => handleFieldChange('email', e.target.value)} 
              />
            ) : (
              <p className="text-muted-foreground">{formData.email}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isEditing && <Button variant="ghost" onClick={handleCancel}>Cancel</Button>}
            {isEditing ? (
              <Button onClick={handleSave}><Save className="w-4 h-4 mr-2" />Save Changes</Button>
            ) : (
              <Button variant="outline" onClick={() => setIsEditing(true)}><Edit className="w-4 h-4 mr-2" />Edit Profile</Button>
            )}
          </div>
        </div>

        <div className="p-8 grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="glass-card p-6 rounded-2xl">
              <h3 className="text-lg font-semibold mb-4">About</h3>
              {isEditing ? (
                <Textarea 
                  value={formData.bio || ''} 
                  onChange={(e) => handleFieldChange('bio', e.target.value)}
                  className="min-h-[120px]"
                />
              ) : (
                <p className="text-muted-foreground">{formData.bio || "No bio provided."}</p>
              )}
            </div>
          </div>
          <div className="md:col-span-1 space-y-6">
            <div className="glass-card p-6 rounded-2xl space-y-4">
              <div>
                <Label>Job Title</Label>
                {isEditing ? <Input value={formData.title || ''} onChange={(e) => handleFieldChange('title', e.target.value)} /> : <p className="text-sm">{formData.title || "Not specified"}</p>}
              </div>
              <div>
                <Label>Timezone</Label>
                {isEditing ? <Input value={formData.timezone || ''} onChange={(e) => handleFieldChange('timezone', e.target.value)} /> : <p className="text-sm">{formData.timezone || "Not specified"}</p>}
              </div>
            </div>
            <div className="glass-card p-6 rounded-2xl">
              <h3 className="text-lg font-semibold mb-4">Skills</h3>
              <SkillsEditor 
                selectedSkills={formData.skills || []}
                setSelectedSkills={(skills) => handleFieldChange('skills', skills)}
                isEditing={isEditing}
              />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
