// app/verification-failed/page.tsx
"use client";

import * as React from 'react';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ApiError } from '@/types'; // <-- 1. Importar el tipo

export default function VerificationFailedPage() {
  const [email, setEmail] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleResend = async () => {
    if (!email) {
      toast.error('Por favor, ingresa tu correo electrónico.');
      return;
    }
    setIsLoading(true);
    try {
      // 2. Especificar el tipo de respuesta esperado: { message: string }
      const response = await apiClient.post<{ message: string }>('/auth/resend-verification', { email });
      toast.success(response.message || 'Correo de verificación enviado. Revisa tu bandeja de entrada.');
    } catch (error) {
      // 3. Manejar el error de forma segura
      const apiError = error as ApiError;
      const errorMessage = apiError.response?.data?.error || (error as Error).message || 'Ocurrió un error inesperado.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center p-4">
      <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
      <h1 className="text-3xl font-bold mb-2">Verificación Fallida</h1>
      <p className="text-muted-foreground mb-6 max-w-sm">
        El enlace de verificación es inválido o ha expirado. Por favor, ingresa tu correo para reenviar el enlace.
      </p>
      <div className="w-full max-w-sm space-y-4">
         <Input
            type="email"
            placeholder="tu-correo@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
        <Button onClick={handleResend} disabled={isLoading} className="w-full">
          {isLoading ? 'Enviando...' : 'Reenviar Correo de Verificación'}
        </Button>
      </div>
    </div>
  );
}