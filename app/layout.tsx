import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { GeistSans } from "geist/font/sans"
import { ThemeProvider } from "@/contexts/theme-context" // Importamos nuestro proveedor principal
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: "Jello",
  description: "Your intelligent productivity ecosystem",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${GeistSans.variable} ${inter.variable} font-sans`}>
        {/* Nuestro ThemeProvider ahora gestiona todo */}
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}