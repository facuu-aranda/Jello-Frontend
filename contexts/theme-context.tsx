"use client"

import type React from "react"
import { createContext, useContext, useEffect } from "react"
import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from "next-themes"

interface CustomThemeContextType {
  theme: string | undefined
  setTheme: (theme: string) => void
  toggleTheme: (event: React.MouseEvent) => void
}

const ThemeContext = createContext<CustomThemeContextType | undefined>(undefined)

// Definimos los colores de fondo exactos para la animación
const THEME_BACKGROUNDS = {
  light: "#ffffff", // --background en modo claro
  dark: "#0f172a",  // --background en modo oscuro
}

function CustomThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useNextTheme()

  const toggleTheme = (event: React.MouseEvent) => {
    const newTheme = theme === "dark" ? "light" : "dark"

    // Acto 1: La Preparación
    const circle = document.createElement("div")
    circle.className = "water-expand" // Asignamos la clase con la animación

    // Asignamos el color de fondo del TEMA DESTINO
    circle.style.backgroundColor = THEME_BACKGROUNDS[newTheme]

    // Posicionamos el círculo en el lugar del clic
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
    circle.style.left = `${rect.left + rect.width / 2}px`
    circle.style.top = `${rect.top + rect.height / 2}px`

    document.body.appendChild(circle)

    // Acto 2: El Cambio Instantáneo (ocurre por debajo)
    setTheme(newTheme)

    // Acto 3: La Limpieza (después de la animación)
    setTimeout(() => {
      document.body.removeChild(circle)
    }, 800) // Duración de la animación
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

// Hook personalizado para usar nuestro contexto
export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

// El proveedor principal que envuelve todo en layout.tsx
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      <CustomThemeProvider>{children}</CustomThemeProvider>
    </NextThemesProvider>
  )
}