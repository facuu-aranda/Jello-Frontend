"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

import {
    ArrowRight,
    Menu,
    Users,
    FolderSearch,
    BookOpen,
    Heart,
    Star,
    Shield,
    Briefcase,
    ClipboardList,
    Lightbulb,
    MessageSquare,
    Check,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AnimatedBackground } from "@/components/animated-background";
import { LoginForm } from "@/components/login-form";
import { RegisterForm } from "@/components/register-form";
import { TaskCard as FloatingTaskCard } from "@/components/tasks/task-card";
import { TaskSummary } from "@/types";

// --- Componente Principal de la Landing Page ---
export default function FinalStyledLandingPage() {
    const [isLoginModalOpen, setIsLoginModalOpen] = React.useState(false);
    const [isRegisterModalOpen, setIsRegisterModalOpen] = React.useState(false);

    return (
        <>
            <div className="relative flex min-h-screen w-full flex-col bg-background text-foreground overflow-x-hidden">
                <AnimatedBackground />

                <Navbar onLogin={() => setIsLoginModalOpen(true)} onRegister={() => setIsRegisterModalOpen(true)} />

                <main className="relative z-10 flex-grow">
                    <HeroSection onRegister={() => setIsRegisterModalOpen(true)} />
                    <DetailedFeaturesSection />
                    <PricingSection onRegister={() => setIsRegisterModalOpen(true)} />
                    <TestimonialsSection onRegister={() => setIsRegisterModalOpen(true)}  />
                    <CtaSection onRegister={() => setIsRegisterModalOpen(true)} />
                </main>

                <Footer />
            </div>

            {/* Modales de Autenticación */}
            <Dialog open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
                <DialogContent className="p-0 border-none bg-transparent w-[90vw] max-w-md">
                    <LoginForm />
                </DialogContent>
            </Dialog>

            <Dialog open={isRegisterModalOpen} onOpenChange={setIsRegisterModalOpen}>
                <DialogContent className="p-0 border-none bg-transparent w-[90vw] max-w-md">
                    <RegisterForm />
                </DialogContent>
            </Dialog>
        </>
    );
}

// --- SUBCOMPONENTES DE LA PÁGINA ---

const Navbar = ({ onLogin, onRegister }: { onLogin: () => void; onRegister: () => void; }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
    const navLinks = [
        { name: "Características", href: "#features" },
        { name: "Precios", href: "#pricing" },
        { name: "Testimonios", href: "#testimonials" },
    ];
    const NavItems = () => (
        <>
            {navLinks.map((link) => (
                <Link key={link.name} href={link.href} className="text-sm font-medium text-card-foreground hover:text-foreground transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                    {link.name}
                </Link>
            ))}
        </>
    );
    return (
        <motion.header initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, ease: "easeOut" }} className="sticky top-4 z-50 mx-auto w-[95%] max-w-7xl">
            <div className="glass-card flex items-center justify-between p-3 rounded-2xl border border-border/50 shadow-lg">
                <Link href="/" className="flex items-center gap-2">
                    <Avatar className="h-8 w-8"><AvatarImage src="/images/jelli-avatar.png" alt="Jello Logo" /><AvatarFallback>J</AvatarFallback></Avatar>
                    <span className="text-xl font-bold">Jello</span>
                </Link>
                <nav className="hidden md:flex items-center gap-6"><NavItems /></nav>
                <div className="hidden md:flex items-center gap-2">
                    <Button variant="ghost" onClick={onLogin}>Sign In</Button>
                    <Button onClick={onRegister}>Get Started</Button>
                </div>
                <div className="md:hidden">
                    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                        <SheetTrigger asChild><Button variant="ghost" size="icon"><Menu className="h-6 w-6" /></Button></SheetTrigger>
                        <SheetContent className="bg-card/80 backdrop-blur-lg border-l border-border/50 p-6">
                            <nav className="flex flex-col gap-6 pt-10">
                                <NavItems />
                                <div className="border-t border-border pt-6 flex flex-col gap-4">
                                    <Button variant="outline" onClick={onLogin}>Sign In</Button>
                                    <Button onClick={onRegister}>Get Started</Button>
                                </div>
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </motion.header>
    );
};

const HeroSection = ({ onRegister }: { onRegister: () => void; }) => {
    const mockTasks: TaskSummary[] = [
        { id: '1', title: 'Plan de Marketing para Lanzamiento', priority: 'high', labels: [{ _id: 'l1', name: 'Marketing', color: '#ec4899' }], assignees: [{ id: 'u1', name: 'S', avatarUrl: '/sarah-avatar.png' }], subtasks: { total: 5, completed: 2 }, status: 'in-progress', dueDate: '2025-11-15', commentCount: 3, attachmentCount: 1, projectId: 'p1' },
        { id: '2', title: 'Investigación de Mercado para App Móvil', priority: 'medium', labels: [{ _id: 'l2', name: 'Investigación', color: '#8b5cf6' }], assignees: [{ id: 'u2', name: 'M', avatarUrl: '/mike-avatar.jpg' }], subtasks: { total: 3, completed: 3 }, status: 'done', dueDate: '2025-10-30', commentCount: 8, attachmentCount: 2, projectId: 'p1' },
        { id: '3', title: 'Crear Repositorio Open-Source del Proyecto', priority: 'low', labels: [{ _id: 'l3', name: 'DevOps', color: '#14b8a6' }], assignees: [{ id: 'u3', name: 'E', avatarUrl: '/placeholder-user.jpg' }], subtasks: { total: 2, completed: 0 }, status: 'todo', dueDate: '2025-11-05', commentCount: 0, attachmentCount: 0, projectId: 'p2' },
    ];
    return (
        <section className="relative py-24 px-4 sm:py-32 text-center overflow-hidden">
            <div className="container relative z-10 max-w-5xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: "easeOut" }}>
                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-balance leading-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
                        Encuentra y Conecta. <br /> Construye sin Límites.
                    </h1>
                    <p className="mt-6 max-w-3xl mx-auto text-lg text-card-foreground text-pretty">
                        Jello es la plataforma flexible que une a personas y proyectos. Busca talento, explora iniciativas de código abierto o gestiona tu próximo gran producto en un solo lugar.
                    </p>
                    <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
                        <Button size="lg" className="group text-lg py-7 px-8 w-full sm:w-auto" onClick={onRegister}>
                            Empieza Gratis
                            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </div>
                </motion.div>
            </div>
            <div className="absolute inset-0 z-0 pointer-events-none">
                <motion.div className="absolute top-[15%] left-[5%] lg:left-[15%] w-72" animate={{ y: [0, -15, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}><FloatingTaskCard task={mockTasks[0]} /></motion.div>
                <motion.div className="absolute bottom-[15%] right-[5%] lg:right-[15%] w-72" animate={{ y: [0, 15, 0] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: -3 }}><FloatingTaskCard task={mockTasks[1]} /></motion.div>
                <motion.div className="absolute top-[55%] left-[10%] w-72 hidden xl:block" animate={{ y: [0, -12, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: -1 }}><FloatingTaskCard task={mockTasks[2]} /></motion.div>
            </div>
        </section>
    );
};

const DetailedFeaturesSection = () => {
    const mainFeatures = [
        { icon: ClipboardList, title: "Gestión de Proyectos Intuitiva", description: "Organiza, planifica y ejecuta tus proyectos con tableros Kanban dinámicos y herramientas visuales.", image: "/images/kanban-preview.png", points: ["Tableros Kanban personalizables", "Gestión de tareas y subtareas", "Fechas de entrega y recordatorios"] },
        { icon: Lightbulb, title: "Asistente con IA: Jelli", description: "Aprovecha la inteligencia artificial para automatizar tareas, obtener resúmenes y generar ideas.", image: "/images/jelli-avatar.png", points: ["Generación automática de tareas", "Resúmenes inteligentes de debates", "Sugerencias proactivas"] },
        { icon: MessageSquare, title: "Colaboración y Comunicación", description: "Mantén a tu equipo conectado con comentarios en tiempo real, menciones y un historial de actividad completo.", image: "/images/image_5c4f9d.jpg", points: ["Comentarios directos en tareas", "Menciones a compañeros de equipo", "Historial de actividad centralizado"] },
    ];
    const platformFeatures = [
        { icon: FolderSearch, title: "Descubre Proyectos", description: "Explora proyectos públicos y open-source. ¡Encuentra tu próxima gran contribución!" },
        { icon: Users, title: "Encuentra Talento", description: "Utiliza nuestra búsqueda para filtrar usuarios por habilidades y roles. Construye tu equipo ideal." },
        { icon: Shield, title: "Control Total", description: "Decide quién ve tu trabajo. Mantén tus proyectos comerciales privados o ábrelos al mundo." },
    
        { icon: Briefcase, title: "Productos y Startups", description: "Herramientas para equipos que buscan lanzar su próximo gran producto." },
        { icon: BookOpen, title: "Código Abierto", description: "Plataforma transparente para colaborar en proyectos open-source." },
        { icon: Heart, title: "Iniciativas Sociales", description: "Organiza voluntarios y gestiona campañas para maximizar tu impacto." },
    ];

    return (
        <section id="features" className="py-24 px-4 ">
            <div className="container max-w-7xl mx-auto">
                <div className="text-center space-y-4 mb-20">
                    <h2 className="text-4xl font-bold">Un Ecosistema Completo para tu Productividad</h2>
                    <p className="text-lg text-card-foreground max-w-3xl mx-auto">Desde la gestión de tareas hasta la búsqueda de talento, Jello tiene todo lo que necesitas para llevar tus ideas a la realidad.</p>
                </div>

                <div className="space-y-20">
                    {mainFeatures.map((feature, index) => (
                        <motion.div key={feature.title} className={`flex flex-col md:flex-row items-center gap-12 lg:gap-24 ${index % 2 === 1 ? "md:flex-row-reverse" : ""}`} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.8, ease: "easeOut" }}>
                            <div className="w-full md:w-1/2">
                                <motion.div className="relative w-full aspect-video rounded-3xl overflow-hidden glass-card p-4 shadow-xl border border-border/50 flex items-center justify-center">
                                    <Image src={feature.image} alt={feature.title} width={600} height={338} className="object-cover rounded-2xl" />
                                </motion.div>
                            </div>
                            <div className="w-full md:w-1/2 space-y-6 text-center md:text-left">
                                <feature.icon className="h-10 w-10 text-primary mx-auto md:mx-0" />
                                <h3 className="text-3xl font-bold">{feature.title}</h3>
                                <p className="text-lg text-card-foreground">{feature.description}</p>
                                <ul className="space-y-3">
                                    {feature.points.map((point, i) => (<li key={i} className="flex items-start gap-3 text-lg"><Check className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" /><span>{point}</span></li>))}
                                </ul>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-24 pt-16 border-t border-border">
                    <div className="text-center space-y-4 mb-16">
                         <h2 className="text-4xl font-bold">Una Plataforma, Infinitas Posibilidades</h2>
                         <p className="text-lg text-card-foreground max-w-3xl mx-auto">Jello está diseñado para ser tan flexible como tus proyectos. No importa si es privado, público o para una causa social.</p>
                    </div>
                    {/* --- INICIO DE CAMBIOS DE ESTILO --- */}
                    <div className="grid md:grid-cols-3 gap-8 mb-12">
                        {platformFeatures.map((feature, index) => (
                             <motion.div key={feature.title} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.6, delay: index * 0.1 }}>
                                <Card className="h-full glass-card p-6 border border-border/50 shadow-lg text-left">
                                    <CardHeader className="flex flex-row items-center gap-4 p-0">
                                        <div className="inline-block p-3 bg-primary/10 rounded-lg">
                                            <feature.icon className="w-8 h-8 text-primary" />
                                        </div>
                                        <CardTitle className="text-xl">{feature.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-0 pt-4">
                                        <p className="text-card-foreground">{feature.description}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                     
                    {/* --- FIN DE CAMBIOS DE ESTILO --- */}
                </div>
            </div>
        </section>
    );
};

const PricingSection = ({ onRegister }: { onRegister: () => void; }) => {
    const tiers = [
        { name: "Gratis", price: "0", period: "/mes", description: "Perfecto para individuos y equipos pequeños.", features: ["3 Proyectos", "Búsqueda de Proyectos Públicos", "Acceso Básico a Jelli AI"], cta: "Comienza Gratis", popular: false },
        { name: "Pro", price: "15", period: "/mes/usuario", description: "Para equipos en crecimiento que necesitan más.", features: ["Proyectos Ilimitados", "Búsqueda Avanzada de Talento", "Acceso Completo a Jelli AI", "Soporte prioritario"], cta: "Prueba Pro Gratis", popular: true },
        { name: "Enterprise", price: "Personalizado", period: "", description: "Soluciones a medida para grandes organizaciones.", features: ["Todo en Pro", "Soporte 24/7 Dedicado", "Seguridad y Compliance (SSO)"], cta: "Contacta a Ventas", popular: false },
    ];
    return (
        <section id="pricing" className="py-24 px-4">
            <div className="container max-w-6xl mx-auto">
                <div className="text-center space-y-4 mb-16">
                    <h2 className="text-4xl font-bold">Planes Simples, Resultados Potentes</h2>
                    <p className="text-lg text-card-foreground max-w-3xl mx-auto">Encuentra el plan que se adapte a tus necesidades, sea cual sea el tamaño de tu equipo.</p>
                </div>
                <div className="grid lg:grid-cols-3 gap-8 items-stretch">
                    {tiers.map((tier, index) => (
                        <motion.div key={tier.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.5, delay: index * 0.1 }} className="h-full">
                            <Card className={`flex flex-col h-full glass-card border ${tier.popular ? "border-primary shadow-2xl scale-[1.03]" : "border-border/50 shadow-lg"} transition-all duration-300 hover:shadow-xl`}>
                                <CardHeader className="relative pb-6">
                                    {tier.popular && <div className="absolute top-0 right-0 -mt-3 mr-6 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">MÁS POPULAR</div>}
                                    <CardTitle className="text-2xl font-bold">{tier.name}</CardTitle>
                                    <div className="flex items-baseline mt-2">
                                        {tier.price !== "Personalizado" ? (<><span className="text-5xl font-extrabold">${tier.price}</span><span className="text-lg font-medium text-card-foreground">{tier.period}</span></>) : (<span className="text-3xl font-extrabold">{tier.price}</span>)}
                                    </div>
                                    <CardDescription className="text-sm text-card-foreground mt-2">{tier.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-grow space-y-3">
                                    <ul className="space-y-3">
                                        {tier.features.map(feature => (<li key={feature} className="flex items-center gap-3 text-sm text-foreground"><Check className="w-4 h-4 text-green-500 flex-shrink-0" /><span>{feature}</span></li>))}
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Button className={`w-full text-base py-6 ${tier.popular ? "bg-primary text-primary-foreground hover:bg-primary/90" : "glass-button"}`} variant={tier.popular ? "default" : "outline"} onClick={onRegister}>{tier.cta}</Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const TestimonialsSection = ({ onRegister }: { onRegister: () => void; }) => {
    const testimonials = [
        { name: "Elena R.", role: "Directora de Proyectos", avatar: "/sarah-avatar.png", text: "Jello ha revolucionado cómo gestionamos proyectos. La IA es un ahorro de tiempo increíble.", rating: 5 },
        { name: "Marcos G.", role: "Fundador de Startup", avatar: "/mike-avatar.jpg", text: "La capacidad de encontrar colaboradores para nuestro proyecto open-source directamente en la plataforma ha sido un cambio radical.", rating: 5 },
        { name: "Sofía M.", role: "Diseñadora UX", avatar: "/placeholder-user.jpg", text: "Me encanta la estética. Es profesional, limpia y las animaciones hacen que usar la app sea un placer.", rating: 5 },
    ];
    return (
        <section id="testimonials" className="py-24 px-4 ">
            <div className="container max-w-7xl mx-auto">
                <div className="text-center space-y-4 mb-16">
                    <h2 className="text-4xl font-bold">Amado por equipos de todo el mundo</h2>
                    <p className="text-lg text-card-foreground max-w-3xl mx-auto">Cientos de equipos confían en Jello para potenciar su productividad diaria.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <motion.div key={testimonial.name} className="glass-card p-6 text-center space-y-4 border border-border/50 shadow-lg flex flex-col justify-between" initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6, delay: index * 0.1 }}>
                            <div>
                                <div className="flex justify-center mb-3">{[...Array(testimonial.rating)].map((_, i) => (<Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />))}</div>
                                <p className="text-card-foreground italic text-pretty leading-relaxed">"{testimonial.text}"</p>
                            </div>
                            <div className="mt-6">
                                <Avatar className="w-16 h-16 mx-auto mb-3 border-4 border-background shadow-lg"><AvatarImage src={testimonial.avatar} alt={testimonial.name} /><AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback></Avatar>
                                <h4 className="font-semibold text-lg text-foreground">{testimonial.name}</h4>
                                <p className="text-sm text-primary">{testimonial.role}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const CtaSection = ({ onRegister }: { onRegister: () => void; }) => (
    <section className="py-24 px-4">
        <div className="container max-w-4xl mx-auto text-center">
            <motion.div className="space-y-6" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.6 }}>
                <h2 className="text-4xl lg:text-5xl font-bold text-balance">Tu Futuro Productivo Comienza Hoy</h2>
                <p className="text-xl text-card-foreground max-w-2xl mx-auto text-pretty">Únete a la nueva era de la gestión de proyectos. Es gratis, es potente, es Jello.</p>
                <Button size="lg" className="group text-lg py-7 px-8 hover:scale-105 transition-transform duration-300" onClick={onRegister}>
                    Empieza a construir tu éxito
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
            </motion.div>
        </div>
    </section>
);

const Footer = () => (
    <footer className="relative z-10 mt-16">
        <div className="glass-card mx-4 mb-4 rounded-t-2xl border border-border/50">
            <div className="container mx-auto px-6 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4">
                    <Link href="/" className="flex items-center gap-2">
                        <Avatar className="h-8 w-8"><AvatarImage src="/images/jelli-avatar.png" alt="Jello Logo" /><AvatarFallback>J</AvatarFallback></Avatar>
                        <span className="text-xl font-bold">Jello</span>
                    </Link>
                    <nav className="flex gap-6">
                        <Link href="#features" className="text-sm text-card-foreground hover:text-foreground">Características</Link>
                        <Link href="#pricing" className="text-sm text-card-foreground hover:text-foreground">Precios</Link>
                        <Link href="#testimonials" className="text-sm text-card-foreground hover:text-foreground">Testimonios</Link>
                    </nav>
                    <p className="text-sm text-card-foreground">© {new Date().getFullYear()} Jello. Todos los derechos reservados.</p>
                </div>
            </div>
        </div>
    </footer>
);