"use client";

import * as React from 'react';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ApiError } from '@/types'; // <-- 1. Importar el tipo

export default function ResetPasswordPage() {
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden.');
      return;
    }
    if (password.length < 8) {
        toast.error('La contraseña debe tener al menos 8 caracteres.');
        return;
    }

    setIsLoading(true);
    try {
      // 2. Especificar el tipo de respuesta esperado: { message: string }
      const response = await apiClient.put<{ message: string }>(`/auth/reset-password/${token}`, { password });
      toast.success(response.message || 'Contraseña actualizada con éxito.');
      setIsSuccess(true);
    } catch (error) {
      // 3. Manejar el error de forma segura
      const apiError = error as ApiError;
      let errorMessage = apiError.response?.data?.error || (error as Error).message || 'Ocurrió un error inesperado.';
      toast.error(errorMessage);
      
      if (apiError.response?.status === 400 || apiError.response?.status === 404) {
         router.push('/verification-failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-2">Establecer Nueva Contraseña</h1>
        {isSuccess ? (
          <div>
            <p className="text-muted-foreground mb-6">
              Tu contraseña ha sido actualizada. Ahora puedes iniciar sesión.
            </p>
            <Button asChild>
              <Link href="/">Ir a Iniciar Sesión</Link>
            </Button>
          </div>
        ) : (
          <>
            <p className="text-muted-foreground mb-6">
              Ingresa tu nueva contraseña a continuación.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="password"
                placeholder="Nueva contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
              <Input
                type="password"
                placeholder="Confirmar nueva contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? 'Actualizando...' : 'Actualizar Contraseña'}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}