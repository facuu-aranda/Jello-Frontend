"use client"

import * as React from "react"
import { useAuth } from "@/contexts/auth-context"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, LoaderCircle } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export function RegisterForm() {
  const { register, isLoading } = useAuth();
  const [formData, setFormData] = React.useState({ firstName: "", lastName: "", email: "", password: "" });
  const [showPassword, setShowPassword] = React.useState(false);
  const [termsAccepted, setTermsAccepted] = React.useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || !termsAccepted) return;
    
    register({
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email,
      password: formData.password
    });
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card p-8 w-full space-y-6"
    >
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold text-foreground">Create your account</h1>
        <p className="text-muted-foreground">Start your productivity journey with Jello</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label htmlFor="firstName" className="text-sm font-medium text-foreground">First name</label>
            <Input id="firstName" name="firstName" placeholder="John" required value={formData.firstName} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <label htmlFor="lastName" className="text-sm font-medium text-foreground">Last name</label>
            <Input id="lastName" name="lastName" placeholder="Doe" required value={formData.lastName} onChange={handleChange} />
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="emailReg" className="text-sm font-medium text-foreground">Email</label>
          <Input id="emailReg" name="email" type="email" placeholder="john@example.com" required value={formData.email} onChange={handleChange} />
        </div>
        <div className="space-y-2">
          <label htmlFor="passwordReg" className="text-sm font-medium text-foreground">Password</label>
          <div className="relative">
            <Input id="passwordReg" name="password" type={showPassword ? "text" : "password"} placeholder="Create a strong password" required value={formData.password} onChange={handleChange} className="pr-10" />
            <Button type="button" variant="ghost" size="icon" className="w-10 rounded-full absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">Must be at least 8 characters long.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="terms" checked={termsAccepted} onCheckedChange={(checked) => setTermsAccepted(Boolean(checked))} />
          <label htmlFor="terms" className="text-sm text-muted-foreground">I agree to the <Link href="/terms" className="underline text-primary">terms and conditions</Link></label>
        </div>
        <Button type="submit" className="w-full" disabled={isLoading || !termsAccepted}>
          {isLoading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? "Creating account..." : "Create account"}
        </Button>
      </form>
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="underline text-primary">Sign In</Link>
      </p>
    </motion.div>
  );
}