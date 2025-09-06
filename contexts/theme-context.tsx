"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import { useTheme as useNextTheme } from "next-themes"

interface ThemeContextType {
  theme: string | undefined
  setTheme: (theme: string) => void
  toggleTheme: (buttonPosition?: { x: number; y: number }) => void
  isAnimating: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, setTheme: setNextTheme } = useNextTheme()
  const [isAnimating, setIsAnimating] = useState(false)

  const createRippleEffect = (x: number, y: number, newTheme: string) => {
    setIsAnimating(true)

    // Create ripple element
    const ripple = document.createElement("div")
    ripple.className = "theme-ripple"

    // Calculate the maximum distance to cover the entire screen
    const maxDistance = Math.sqrt(
      Math.pow(Math.max(x, window.innerWidth - x), 2) + Math.pow(Math.max(y, window.innerHeight - y), 2),
    )

    // Set initial styles
    Object.assign(ripple.style, {
      position: "fixed",
      left: `${x}px`,
      top: `${y}px`,
      width: "0px",
      height: "0px",
      borderRadius: "50%",
      backgroundColor: newTheme === "dark" ? "#0f172a" : "#ffffff",
      transform: "translate(-50%, -50%)",
      zIndex: "9999",
      pointerEvents: "none",
      transition: "all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    })

    document.body.appendChild(ripple)

    // Trigger animation
    requestAnimationFrame(() => {
      Object.assign(ripple.style, {
        width: `${maxDistance * 2}px`,
        height: `${maxDistance * 2}px`,
      })
    })

    // Change theme after a delay to sync with animation
    setTimeout(() => {
      setNextTheme(newTheme)
    }, 400)

    // Clean up
    setTimeout(() => {
      document.body.removeChild(ripple)
      setIsAnimating(false)
    }, 800)
  }

  const toggleTheme = (buttonPosition?: { x: number; y: number }) => {
    const newTheme = theme === "dark" ? "light" : "dark"

    if (buttonPosition) {
      createRippleEffect(buttonPosition.x, buttonPosition.y, newTheme)
    } else {
      setNextTheme(newTheme)
    }
  }

  const setTheme = (newTheme: string) => {
    setNextTheme(newTheme)
  }

  return <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, isAnimating }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
