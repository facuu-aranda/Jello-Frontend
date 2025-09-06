import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider as NextThemeProvider } from "@/components/theme-provider"
import { ThemeProvider } from "@/contexts/theme-context"
import { Suspense } from "react"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Jello - Your Intelligent Productivity Ecosystem",
  description: "A unified productivity ecosystem that adapts to you, not the other way around.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${inter.variable} antialiased`}>
        <Suspense fallback={null}>
          <NextThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange={false}>
            <ThemeProvider>{children}</ThemeProvider>
          </NextThemeProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
