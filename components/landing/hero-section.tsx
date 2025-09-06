"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

export function HeroSection() {
  return (
    <section className="relative py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="space-y-4">
              <motion.div
                className="inline-flex items-center gap-2 glass-card px-4 py-2 text-sm font-medium text-primary"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                Your Intelligent Work Partner
              </motion.div>

              <h1 className="text-4xl lg:text-6xl font-bold text-balance leading-tight">
                Productivity that <span className="text-primary">adapts to you</span>, not the other way around
              </h1>

              <p className="text-xl text-muted-foreground text-pretty max-w-2xl">
                Jello unifies your professional and personal productivity with AI-powered assistance, seamless
                collaboration, and deep customization that grows with your workflow.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register">
                <Button size="lg" className="group">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="group bg-transparent">
                <Play className="mr-2 h-4 w-4" />
                Watch Demo
              </Button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-4 pt-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <Avatar key={i} className="w-8 h-8 border-2 border-background">
                    <AvatarImage
                      src={`/abstract-geometric-shapes.png?height=32&width=32&query=user${i}`}
                      alt={`User ${i}`}
                    />
                    <AvatarFallback>U{i}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <div className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">2,000+</span> teams already boosting productivity
              </div>
            </div>
          </motion.div>

          {/* Visual */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            <div className="glass-card p-8 space-y-6">
              {/* Jelli Characters */}
              <div className="flex justify-center">
                <motion.img
                  src="/images/jelli-planning.gif"
                  alt="Jelli characters collaborating"
                  className="w-64 h-48 object-contain"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                />
              </div>

              {/* Mock Interface */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-primary rounded-full" />
                  <div className="flex-1 h-2 bg-muted rounded-full">
                    <div className="w-3/4 h-full bg-primary rounded-full" />
                  </div>
                  <span className="text-xs text-muted-foreground">75%</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-accent rounded-full" />
                  <div className="flex-1 h-2 bg-muted rounded-full">
                    <div className="w-1/2 h-full bg-accent rounded-full" />
                  </div>
                  <span className="text-xs text-muted-foreground">50%</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-accent-teal rounded-full" />
                  <div className="flex-1 h-2 bg-muted rounded-full">
                    <div className="w-5/6 h-full bg-accent-teal rounded-full" />
                  </div>
                  <span className="text-xs text-muted-foreground">85%</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
