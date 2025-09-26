"use client"

import type * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

// CORREGIDO: Se cambia el nombre de la prop de 'icon' a 'as' para mayor claridad y
// se ajusta para recibir un componente, que es la práctica estándar.
interface IconProps extends React.SVGProps<SVGSVGElement> {
  as: React.ElementType;
  size?: "sm" | "md" | "lg" | "xl";
  animated?: boolean;
}

const sizeClasses = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
  xl: "w-8 h-8",
}

export function Icon({ as: Component, size = "md", animated = false, className, ...props }: IconProps) {
  const MotionComponent = motion(Component);

  return animated ? (
    <MotionComponent
      className={cn("inline-block", sizeClasses[size], className)}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      {...props}
    />
  ) : (
    <Component
      className={cn("inline-block", sizeClasses[size], className)}
      {...props}
    />
  );
}
