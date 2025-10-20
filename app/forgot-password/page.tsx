"use client";

import * as React from 'react';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { ApiError } from '@/types'; // <-- 1. Importar el tipo

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // 2. Especificar el tipo de respuesta esperado: { message: string }
      const response = await apiClient.post<{ message: string }>('/auth/forgot-password', { email });
      toast.success(response.message || 'Si el correo es válido, recibirás un enlace para recuperar tu contraseña.');
      setIsSubmitted(true);
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-2">Recuperar Contraseña</h1>
        {isSubmitted ? (
          <p className="text-muted-foreground">
            Revisa tu correo electrónico para continuar con el proceso.
          </p>
        ) : (
          <>
            <p className="text-muted-foreground mb-6">
              Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="email"
                placeholder="tu-correo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? 'Enviando...' : 'Enviar Enlace'}
              </Button>
            </form>
          </>
        )}
        <Button variant="link" asChild className="mt-4">
          <Link href="/">Volver a Inicio</Link>
        </Button>
      </div>
    </div>
  );
}