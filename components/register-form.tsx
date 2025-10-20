"use client";

import * as React from "react";
import { useAuth } from "@/contexts/auth-context";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, LoaderCircle, CheckCircle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const GoogleIcon = () => <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>;
const GitHubIcon = () => <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.024-.105-.949-.199-2.403.041-3.439.219-.937 1.404-5.965 1.404-5.965s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.221.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.748-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z" /></svg>;

export function RegisterForm({ onSwitchToLogin }: { onSwitchToLogin: () => void }) {
  const { register, isLoading } = useAuth();
  const [formData, setFormData] = React.useState({ firstName: "", lastName: "", email: "", password: "" });
  const [showPassword, setShowPassword] = React.useState(false);
  const [termsAccepted, setTermsAccepted] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false); // Nuevo estado

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || !termsAccepted) return;
    
    const result = await register({
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email,
      password: formData.password
    });

    if (result.success) {
      setIsSubmitted(true);
    }
  };

  // Si el formulario ya se envió, mostramos el mensaje de éxito.
  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card p-8 w-full space-y-6 text-center"
      >
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-foreground">¡Registro Exitoso!</h1>
        <p className="text-muted-foreground">
          Por favor, revisa tu correo electrónico para activar tu cuenta.
        </p>
      </motion.div>
    );
  }
return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card p-8 w-full space-y-6"
    >
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold text-foreground">Crea tu cuenta</h1>
        <p className="text-muted-foreground">Comienza tu viaje de productividad con Jello</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label htmlFor="firstName" className="text-sm font-medium text-foreground">Nombre</label>
            <Input id="firstName" name="firstName" placeholder="John" required value={formData.firstName} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <label htmlFor="lastName" className="text-sm font-medium text-foreground">Apellido</label>
            <Input id="lastName" name="lastName" placeholder="Doe" required value={formData.lastName} onChange={handleChange} />
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="emailReg" className="text-sm font-medium text-foreground">Email</label>
          <Input id="emailReg" name="email" type="email" placeholder="john@example.com" required value={formData.email} onChange={handleChange} />
        </div>
        <div className="space-y-2">
          <label htmlFor="passwordReg" className="text-sm font-medium text-foreground">Contraseña</label>
          <div className="relative">
            <Input id="passwordReg" name="password" type={showPassword ? "text" : "password"} placeholder="Crea una contraseña segura" required value={formData.password} onChange={handleChange} className="pr-10" />
            <Button type="button" variant="ghost" size="icon" className="w-10 rounded-full absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">Debe tener al menos 8 caracteres.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="terms" checked={termsAccepted} onCheckedChange={(checked) => setTermsAccepted(Boolean(checked))} />
          <label htmlFor="terms" className="text-sm text-muted-foreground">Acepto los <Link href="/terms" className="underline text-primary">términos y condiciones</Link></label>
        </div>
        <Button type="submit" className="w-full" disabled={isLoading || !termsAccepted}>
          {isLoading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? "Creando cuenta..." : "Crear cuenta"}
        </Button>
      </form><div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">O regístrate con</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 flex-row items-center justify-center">
        <Button asChild variant="outline" className="bg-transparent">
          <a href="https://jello-backend.onrender.com/api/auth/google">
            <GoogleIcon />Google
          </a>
        </Button>
        <Button asChild variant="outline" className="bg-transparent">
          <a href="https://jello-backend.onrender.com/api/auth/github">
            <GitHubIcon />GitHub
          </a>
        </Button>
      </div>
      
      <p className="text-center text-sm text-muted-foreground">
        ¿Ya tienes una cuenta?{' '}
        {/* 3. Reemplazamos <Link> por <button> */}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="underline text-primary font-medium focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm"
        >
          Inicia Sesión
        </button>
      </p>
    </motion.div>
  );
}