import type React from "react"
import type { Metadata } from "next"
import { Suspense } from "react"
import { AuthProvider } from "@/contexts/auth-context"
import { NavigationProvider } from "@/contexts/navigation-context"
import { NavigationProgress } from "@/components/navigation-progress"
import { Inter, Outfit } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Fortaleza Colchoes - Gestão de Clientes e Estoque",
  description: "Plataforma de gestão para loja de colchões",
  generator: "Bruno Carolino",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${outfit.variable}`}>
      <body className="font-sans antialiased">
        <NavigationProvider>
          <NavigationProgress />
          <AuthProvider>
            <Suspense fallback={null}>{children}</Suspense>
          </AuthProvider>
        </NavigationProvider>
      </body>
    </html>
  )
}
