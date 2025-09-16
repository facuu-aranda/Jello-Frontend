"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CtaSection() {
  return (
    <section className="py-24 px-4">
      <div className="container mx-auto max-w-4xl text-center">
        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-balance">
            Listo para transformar tu productividad?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Únete a miles de equipos que ya están construyendo su futuro, una tarea a la vez. Es gratis para empezar.
          </p>
          <Link href="/register">
            <Button size="lg" className="group text-lg py-7 px-8">
              Empieza a construir
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}