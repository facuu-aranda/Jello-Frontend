"use client"

import { motion } from "framer-motion"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

const testimonials = [
  {
    name: "Sarah L.",
    role: "Product Manager",
    avatar: "/sarah-avatar.png",
    text: "Jello ha transformado la forma en que nuestro equipo colabora. La integración de la IA para resumir tareas es simplemente brillante."
  },
  {
    name: "Mike C.",
    role: "Lead Developer",
    avatar: "/mike-avatar.jpg",
    text: "Finalmente una herramienta que no se siente como un obstáculo. Es rápida, intuitiva y se adapta a nuestro flujo de trabajo ágil a la perfección."
  },
  {
    name: "Alex R.",
    role: "UX Designer",
    avatar: "/diverse-user-avatars.png",
    text: "Visualmente, es una delicia. La interfaz de cristal y las animaciones fluidas hacen que gestionar tareas sea una experiencia agradable."
  }
]

export function TestimonialsSection() {
  return (
    <section className="py-20 px-4 bg-card/50">
      <div className="container mx-auto max-w-6xl">
        <motion.div 
          className="text-center space-y-4 mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl lg:text-5xl font-bold">Amado por equipos de todo el mundo</h2>
          <p className="text-xl text-muted-foreground">No confíes solo en nuestra palabra, mira lo que dicen nuestros usuarios.</p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={testimonial.name}
              className="glass-card p-6 text-center space-y-4"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Avatar className="w-16 h-16 mx-auto border-4 border-background">
                <AvatarImage src={testimonial.avatar} />
                <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <p className="text-muted-foreground italic">"{testimonial.text}"</p>
              <div>
                <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                <p className="text-sm text-primary">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}