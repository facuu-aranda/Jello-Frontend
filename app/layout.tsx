// RUTA: app/layout.tsx - CORREGIDO

import "./globals.css";
//import { Inter } from "next/font/local";
import { GeistSans } from "geist/font/sans";

//const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "Jello",
  description: "Your intelligent productivity ecosystem",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // El `lang` será gestionado por Next.js y next-intl
    <html suppressHydrationWarning>
      <body className={`${GeistSans.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}