"use client"

import { motion } from "framer-motion"
import { Users, Brain, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

const features = [
  {
    icon: Users,
    title: "Seamless Collaboration",
    description:
      "Unite your team with flexible Kanban boards, real-time communication, and granular permissions that scale with your projects.",
    color: "bg-primary",
    accent: "text-primary",
  },
  {
    icon: Brain,
    title: "AI-Powered Intelligence",
    description:
      "Meet Jelli, your contextual AI assistant that creates tasks, provides smart summaries, and helps you focus on what matters most.",
    color: "bg-accent",
    accent: "text-accent",
  },
  {
    icon: Zap,
    title: "Total Customization",
    description:
      "Shape Jello to your exact workflow with custom statuses, labels, and columns. Your tool adapts to you, not the other way around.",
    color: "bg-accent-teal",
    accent: "text-accent-teal",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          className="text-center space-y-4 mb-16"
          initial={{ opacity: 0}}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl lg:text-5xl font-bold text-balance">
            Everything you need to <span className="text-primary">work smarter</span>
          </h2>
          <p className="text-xl text-muted-foreground text-pretty max-w-3xl mx-auto">
            Jello brings together the best of project management, personal productivity, and AI assistance in one
            beautiful, intuitive platform.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="glass-card p-8 space-y-6 group hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0}}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              {/* Icon */}
              <div className={`w-12 h-12 ${feature.color} rounded-2xl flex items-center justify-center`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>

              {/* Content */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>

              {/* Action */}
              <Button variant="ghost" className={`group-hover:${feature.accent} transition-colors`}>
                Learn more
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Button size="lg" variant="outline">
            Explore All Features
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
