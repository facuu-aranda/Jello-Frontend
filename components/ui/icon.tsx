"use client"

import type * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: "sm" | "md" | "lg" | "xl"
  animated?: boolean
}

const sizeClasses = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
  xl: "w-8 h-8",
}

export function Icon({ size = "md", animated = false, className, children, ...props }: IconProps) {
  const Component = animated ? motion.svg : "svg"
  const motionProps = animated
    ? {
        whileHover: { scale: 1.1 },
        whileTap: { scale: 0.9 },
        transition: { type: "spring", stiffness: 400, damping: 17 },
      }
    : {}

  return (
    <Component
      className={cn("inline-block", sizeClasses[size], className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...motionProps}
      {...props}
    >
      {children}
    </Component>
  )
}
