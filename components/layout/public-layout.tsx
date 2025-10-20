"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "@/components/ui/language-switcher"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { AnimatedBackground } from "@/components/animated-background"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { LoginForm } from "@/components/login-form"
import { RegisterForm } from "@/components/register-form"
import { Menu } from "lucide-react"

interface PublicLayoutProps {
  children: React.ReactNode
}

export function PublicLayout({ children }: PublicLayoutProps) {
  // --- CAMBIO: Se añade el estado y las funciones para manejar los modales ---
  const [isLoginModalOpen, setIsLoginModalOpen] = React.useState(false)
  const [isRegisterModalOpen, setIsRegisterModalOpen] = React.useState(false)

  const switchToRegister = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(true);
  };

  const switchToLogin = () => {
    setIsRegisterModalOpen(false);
    setIsLoginModalOpen(true);
  };
  // --- FIN DEL CAMBIO ---

  const navLinks = (
    <>
      <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
        Features
      </Link>
      <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
        Pricing
      </Link>
      <Link href="#about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
        About
      </Link>
    </>
  )

  return (
    <>
      <div className="min-h-screen relative">
        <AnimatedBackground />

        <motion.nav
          className="relative z-20 glass-card mx-4 mt-4 rounded-2xl"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="container mx-auto px-6 py-3">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="/images/jelli-avatar.png" alt="Jello" />
                  <AvatarFallback>J</AvatarFallback>
                </Avatar>
                <span className="text-xl font-bold text-foreground">Jello</span>
              </Link>

              <div className="hidden md:flex items-center gap-6">{navLinks}</div>

              <div className="flex items-center gap-2">
                <div className="hidden sm:block"><LanguageSwitcher /></div>
                <Button variant="ghost" size="sm" onClick={() => setIsLoginModalOpen(true)} className="hidden sm:inline-flex">
                  Sign In
                </Button>
                <Button size="sm" onClick={() => setIsRegisterModalOpen(true)} className="hidden sm:inline-flex">
                  Get Started
                </Button>

                <div className="md:hidden">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle Menu</span>
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className=" bg-card/80 backdrop-blur-lg border-none p-0 flex flex-col">
                      <div className="p-4 border-b border-border/50">
                        <Link href="/" className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src="/images/jelli-avatar.png" alt="Jello" />
                            <AvatarFallback>J</AvatarFallback>
                          </Avatar>
                          <span className="text-xl font-bold text-foreground">Jello</span>
                        </Link>
                      </div>

                      <div className="p-4 flex flex-col gap-4 text-left">
                        {navLinks}
                      </div>

                      <div className="flex-grow" />

                      <div className="p-4 mt-8 pt-6 border-t border-border/50 flex flex-col gap-3">
                        <Button variant="outline" onClick={() => setIsLoginModalOpen(true)} className="w-full">Sign In</Button>
                        <Button onClick={() => setIsRegisterModalOpen(true)} className="w-full">Get Started</Button>
                        <div className="pt-2 flex justify-center">
                          <LanguageSwitcher />
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>
            </div>
          </div>
        </motion.nav>

        <main className="relative z-10">{children}</main>

        <footer className="relative z-10 mt-20">
          <div className="glass-card mx-4 mb-4 rounded-2xl">
            <div className="container mx-auto px-6 py-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src="/images/jelli-avatar.png" alt="Jello" />
                      <AvatarFallback>J</AvatarFallback>
                    </Avatar>
                    <span className="font-bold text-foreground">Jello</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Your intelligent productivity ecosystem that adapts to you.
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">Product</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li><Link href="#features" className="hover:text-foreground transition-colors">Features</Link></li>
                    <li><Link href="#pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
                    <li><Link href="#integrations" className="hover:text-foreground transition-colors">Integrations</Link></li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">Company</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li><Link href="#about" className="hover:text-foreground transition-colors">About</Link></li>
                    <li><Link href="#blog" className="hover:text-foreground transition-colors">Blog</Link></li>
                    <li><Link href="#careers" className="hover:text-foreground transition-colors">Careers</Link></li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">Support</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li><Link href="#help" className="hover:text-foreground transition-colors">Help Center</Link></li>
                    <li><Link href="#contact" className="hover:text-foreground transition-colors">Contact</Link></li>
                    <li><Link href="#privacy" className="hover:text-foreground transition-colors">Privacy</Link></li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-border mt-8 pt-8 text-center">
                <p className="text-sm text-muted-foreground">© 2024 Jello. All rights reserved.</p>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* --- CAMBIO: Se pasan las props para intercambiar modales --- */}
      <Dialog open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
        <DialogContent className="p-0 border-none bg-transparent w-[90vw] max-w-md">
          <LoginForm onSwitchToRegister={switchToRegister} />
        </DialogContent>
      </Dialog>

      <Dialog open={isRegisterModalOpen} onOpenChange={setIsRegisterModalOpen}>
        <DialogContent className="p-0 border-none bg-transparent w-[90vw] max-w-md">
          <RegisterForm onSwitchToLogin={switchToLogin} />
        </DialogContent>
      </Dialog>
    </>
  )
}
