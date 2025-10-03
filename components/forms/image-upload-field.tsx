// components/forms/image-upload-field.tsx

"use client";

import { useState, useRef } from 'react';
import { UploadCloud, X, Image as ImageIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface ImageUploadFieldProps {
  name: string;
  label: string;
  onChange: (file: File | null) => void;
  initialImage?: string | null; // <-- Corrección: Propiedad añadida
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({ name, label, onChange, initialImage }) => {
  const [preview, setPreview] = useState<string | null>(initialImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
    onChange(file);
  };

  const handleRemoveImage = () => {
    setPreview(null);
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium text-muted-foreground">
        {label}
      </label>
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16 rounded-lg">
          <AvatarImage src={preview || undefined} className="object-cover" />
          <AvatarFallback className="rounded-lg bg-muted">
            <ImageIcon className="h-8 w-8 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <input
            type="file"
            id={name}
            name={name}
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/png, image/jpeg, image/gif"
          />
          {preview ? (
            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" size="sm" onClick={handleUploadClick}>
                Change
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={handleRemoveImage}>
                <X className="mr-2 h-4 w-4" /> Remove
              </Button>
            </div>
          ) : (
            <Button type="button" variant="outline" size="sm" onClick={handleUploadClick}>
              <UploadCloud className="mr-2 h-4 w-4" /> Upload
            </Button>
          )}
          <p className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF up to 5MB.</p>
        </div>
      </div>
    </div>
  );
};