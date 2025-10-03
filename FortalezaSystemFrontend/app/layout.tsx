import type React from "react"
import type { Metadata } from "next"
import { Suspense } from "react"
import { AuthProvider } from "@/contexts/auth-context"
import "./globals.css"

export const metadata: Metadata = {
  title: "Fortaleza System - Gestão de Clientes e Estoque",
  description: "Plataforma de gestão para loja de colchões",
  generator: "Bruno Carolino",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className="font-sans antialiased">
        <AuthProvider>
          <Suspense fallback={null}>{children}</Suspense>
        </AuthProvider>
      </body>
    </html>
  )
}
