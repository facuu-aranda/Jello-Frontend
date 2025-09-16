"use client"

import { motion } from "framer-motion"
import { Users, Brain, Zap } from "lucide-react"

const features = [
  {
    icon: Users,
    title: "Colaboración Fluida",
    description: "Unifica a tu equipo con tableros Kanban flexibles y comunicación en tiempo real que escala con tus proyectos.",
    image: "/diverse-user-avatars.png"
  },
  {
    icon: Brain,
    title: "Inteligencia Artificial Integrada",
    description: "Conoce a Jelli, tu asistente contextual que crea tareas, genera resúmenes y te ayuda a enfocarte en lo que de verdad importa.",
    image: "/images/jelli-avatar.png"
  },
  {
    icon: Zap,
    title: "Personalización Total",
    description: "Adapta Jello a tu flujo de trabajo con estados, etiquetas y columnas personalizadas. La herramienta se adapta a ti.",
    image: "/abstract-geometric-shapes.png"
  },
]

export function FeaturesSectionV2() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl space-y-24">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            className={`grid md:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? "md:grid-flow-col-dense" : ""}`}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <div className={`space-y-6 ${index % 2 === 1 ? "md:col-start-2" : ""}`}>
              <div className="inline-flex items-center gap-3">
                <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">{feature.title}</h3>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
            <div className="glass-card p-6">
              <img src={feature.image} alt={feature.title} className="rounded-xl w-full h-auto" />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}