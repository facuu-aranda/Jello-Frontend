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
import { Edit, Save, Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { api } from "@/lib/api/client"
import { User } from "@/lib/api/types"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProfilePage() {
  const { token } = useAuth();
  const [isEditing, setIsEditing] = React.useState(false);
  const [profileData, setProfileData] = React.useState<User | null>(null);
  const [newAvatar, setNewAvatar] = React.useState<File | null>(null);
  const [newBanner, setNewBanner] = React.useState<File | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    const fetchProfile = async () => {
      // No ejecutar si no hay token
      if (!token) {
        setIsLoading(false);
        return;
      };
      
      setIsLoading(true);
      try {
        // La documentación especifica un PUT, pero para obtener datos asumimos un GET.
        // Si no existe, se puede adaptar para usar los datos del AuthContext como fallback.
        const data = await api.get('/user/profile', token);
        setProfileData(data);
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
        // Fallback a los datos básicos del contexto si la llamada detallada falla
        // setProfileData(user); 
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  // Helper para manejar cambios en el estado anidado
  const handleChange = (field: keyof User, value: any) => {
    setProfileData(prev => (prev ? { ...prev, [field]: value } : null));
  };

  const handleSave = async () => {
    if (!profileData || !token) return;
    setIsSaving(true);
    try {
      let updatedAvatarUrl = profileData.avatarUrl;
      let updatedBannerUrl = profileData.bannerUrl;

      // 1. Subir avatar si hay uno nuevo
      if (newAvatar) {
        const res = await api.upload(newAvatar, token);
        updatedAvatarUrl = res.url;
      }
      // 2. Subir banner si hay uno nuevo
      if (newBanner) {
        const res = await api.upload(newBanner, token);
        updatedBannerUrl = res.url;
      }

      // 3. Construir el payload final
      const updatePayload = {
        ...profileData,
        avatarUrl: updatedAvatarUrl,
        bannerUrl: updatedBannerUrl,
      };
      
      // 4. Enviar la petición de actualización
      const updatedProfile = await api.put('/user/profile', updatePayload, token);
      
      // 5. Actualizar estado local y salir del modo edición
      setProfileData(updatedProfile);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save profile:", error);
      // Aquí podrías mostrar una notificación (toast) de error al usuario
    } finally {
      setIsSaving(false);
      setNewAvatar(null);
      setNewBanner(null);
    }
  };
  
  // Muestra un esqueleto de la UI mientras se cargan los datos
  if (isLoading) {
    return (
        <AppLayout>
            <div className="max-w-5xl mx-auto space-y-8 pb-12">
                <Skeleton className="h-48 w-full rounded-2xl" />
                <div className="pt-14 px-8 flex justify-between items-start">
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                </div>
                 <div className="p-8 grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-6">
                        <Skeleton className="h-40 w-full rounded-2xl" />
                    </div>
                    <div className="md:col-span-1 space-y-6">
                        <Skeleton className="h-40 w-full rounded-2xl" />
                    </div>
                 </div>
            </div>
        </AppLayout>
    );
  }

  if (!profileData) {
    return <AppLayout><div>Error: No se pudieron cargar los datos del perfil.</div></AppLayout>
  }

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-8 pb-12">
        <div className="relative">
          <div className="h-48 bg-muted rounded-2xl overflow-hidden relative">
            <img src={newBanner ? URL.createObjectURL(newBanner) : profileData.bannerUrl || '/placeholder.jpg'} alt="Banner" className="w-full h-full object-cover" />
            {isEditing && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <ImageUploadField label="Banner" name="bannerImage" onChange={setNewBanner} />
              </div>
            )}
          </div>
          <div className="absolute -bottom-12 left-8">
            <div className="relative">
              <Avatar className="w-24 h-24 rounded-full border-4 border-background">
                <AvatarImage src={newAvatar ? URL.createObjectURL(newAvatar) : profileData.avatarUrl} />
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
                onChange={(e) => handleChange('name', e.target.value)} 
              />
            ) : (
              <h1 className="text-3xl font-bold">{profileData.name}</h1>
            )}
             {isEditing ? (
              <Input 
                className="text-muted-foreground p-0 h-auto border-none focus-visible:ring-0" 
                value={profileData.email} 
                onChange={(e) => handleChange('email', e.target.value)} 
              />
            ) : (
              <p className="text-muted-foreground">{profileData.email}</p>
            )}
          </div>
          {isEditing ? (
            <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
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
                  value={profileData.bio || ''}
                  onChange={(e) => handleChange('bio', e.target.value)}
                  className="min-h-[120px]"
                />
              ) : (
                <p className="text-muted-foreground">{profileData.bio || 'No bio provided.'}</p>
              )}
            </div>
          </div>
          <div className="md:col-span-1 space-y-6">
            <div className="glass-card p-6 rounded-2xl space-y-4">
              <div>
                <Label>Job Title</Label>
                {isEditing ? <Input value={profileData.jobTitle || ''} onChange={(e) => handleChange('jobTitle', e.target.value)} /> : <p className="text-sm">{profileData.jobTitle || 'Not specified'}</p>}
              </div>
              <div>
                <Label>Timezone</Label>
                {isEditing ? <Input value={profileData.timezone || ''} onChange={(e) => handleChange('timezone', e.target.value)} /> : <p className="text-sm">{profileData.timezone || 'Not specified'}</p>}
              </div>
            </div>
            <div className="glass-card p-6 rounded-2xl">
              <h3 className="text-lg font-semibold mb-4">Skills</h3>
              <SkillsEditor 
                selectedSkills={profileData.skills || []}
                setSelectedSkills={(skills) => handleChange('skills', skills)}
                isEditing={isEditing}
              />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}