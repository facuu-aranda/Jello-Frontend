"use client"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function NextThemeProvider({ children, ...props }: any) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
