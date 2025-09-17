"use client"
import * as React from "react"
import { UploadCloud, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface ImageUploadFieldProps {
  label: string;
  name: string;
  onChange: (file: File | null) => void;
  currentImageUrl?: string | null;
}

export function ImageUploadField({ label, name, onChange, currentImageUrl }: ImageUploadFieldProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(currentImageUrl || null);

  React.useEffect(() => { setPreviewUrl(currentImageUrl || null) }, [currentImageUrl]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onChange(file);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <div className="flex items-center gap-4">
        <div 
          className="relative w-24 h-16 rounded-lg border-2 border-dashed flex items-center justify-center overflow-hidden bg-muted/50 cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          {previewUrl ? (
            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
          )}
          <input id={name} name={name} type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
        </div>
        <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
          <UploadCloud className="mr-2 h-4 w-4" /> Subir
        </Button>
      </div>
    </div>
  );
}