"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TaskCard } from "@/components/tasks/task-card"

// 👇 --- DATOS DE EJEMPLO CORRECTOS AÑADIDOS --- 👇
const mockTask1 = {
  id: "1",
  title: "Diseñar Mockups de Alta Fidelidad",
  priority: "high" as const,
  labels: [{ id: "1", name: "Diseño", color: "#ec4899" }],
  assignees: [{ id: "1", name: "S", avatar: "/sarah-avatar.png" }],
  commentsCount: 5,
  attachmentsCount: 2,
  subtasks: { completed: 1, total: 3 },
};

const mockTask2 = {
  id: "2",
  title: "Investigación de API de Pagos",
  priority: "medium" as const,
  labels: [{ id: "3", name: "Backend", color: "#14b8a6" }],
  assignees: [{ id: "2", name: "M", avatar: "/mike-avatar.jpg" }],
  commentsCount: 2,
  attachmentsCount: 1,
  subtasks: { completed: 0, total: 2 },
};

const mockTask3 = {
  id: "3",
  title: "Crear Componente de Botón",
  priority: "low" as const,
  labels: [{ id: "2", name: "Frontend", color: "#8b5cf6" }],
  assignees: [{ id: "3", name: "A", avatar: "/diverse-user-avatars.png" }],
  commentsCount: 0,
  attachmentsCount: 0,
  subtasks: { completed: 4, total: 4 },
};
// 👆 --- FIN DE LOS DATOS DE EJEMPLO --- 👆


export function HeroSectionV2() {
  return (
    <section className="relative py-20 px-4 overflow-hidden">
      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            className="space-y-8 z-10"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-4xl lg:text-6xl font-bold text-balance leading-tight">
              Organiza tu caos, <span className="text-primary">encuentra tu foco.</span>
            </h1>
            <p className="text-xl text-muted-foreground text-pretty max-w-2xl">
              Jello es el ecosistema de productividad que se adapta a ti. Gestiona proyectos complejos y tareas personales con la ayuda de una IA inteligente.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register">
                <Button size="lg" className="group w-full sm:w-auto">
                  Empieza Gratis
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            className="relative h-96 hidden lg:block"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            {/* 👇 --- TARJETAS CON DATOS CORRECTOS --- 👇 */}
            <motion.div className="absolute top-0 left-1/4" animate={{ y: [0, -15, 0] }} transition={{ duration: 5, repeat: Infinity, repeatType: "mirror" }}>
              <TaskCard task={mockTask1} />
            </motion.div>
            <motion.div className="absolute bottom-0 left-0" animate={{ y: [0, 10, 0] }} transition={{ duration: 6, repeat: Infinity, delay: 1, repeatType: "mirror" }}>
              <TaskCard task={mockTask2} />
            </motion.div>
            <motion.div className="absolute top-1/4 right-0" animate={{ y: [0, -10, 0] }} transition={{ duration: 7, repeat: Infinity, delay: 0.5, repeatType: "mirror" }}>
              <TaskCard task={mockTask3} />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}