"use client"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const colors = [
  { name: "Pink", value: "#ec4899", class: "bg-accent-pink" },
  { name: "Purple", value: "#8b5cf6", class: "bg-accent-purple" },
  { name: "Teal", value: "#14b8a6", class: "bg-accent-teal" },
  { name: "Blue", value: "#3b82f6", class: "bg-primary" },
  { name: "Green", value: "#10b981", class: "bg-green-500" },
  { name: "Orange", value: "#f59e0b", class: "bg-orange-500" },
  { name: "Red", value: "#ef4444", class: "bg-red-500" },
  { name: "Gray", value: "#6b7280", class: "bg-gray-500" },
]

interface ColorPickerProps {
  value?: string
  onChange?: (color: string) => void
  className?: string
}

export function ColorPicker({ value, onChange, className }: ColorPickerProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {colors.map((color) => (
        <motion.button
          key={color.value}
          type="button"
          className={cn(
            "w-8 h-8 rounded-full border-2 border-transparent",
            color.class,
            value === color.value && "border-foreground ring-2 ring-ring ring-offset-2",
          )}
          onClick={() => onChange?.(color.value)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          title={color.name}
        />
      ))}
    </div>
  )
}
