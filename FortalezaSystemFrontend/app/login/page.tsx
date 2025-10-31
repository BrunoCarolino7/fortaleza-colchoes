"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Sparkles, ArrowRight } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"

export default function LoginPage() {
  const [user, setUser] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleToglePasswordVisibility = () => {
    setVisible(!visible)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const result = await login(user, password)
    if (result.success) {
      console.log("Login bem-sucedido")
      router.push("/dashboard")
    } else {
      setError("Email ou senha incorretos")
    }

    setIsLoading(false)
  }

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-background">
      {/* Left side - Branding and visual */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-primary via-accent to-primary p-12 items-center justify-center overflow-hidden">
        {/* Animated gradient mesh background */}
        <div className="absolute inset-0 gradient-mesh opacity-30 animate-pulse" />

        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float-delayed" />

        {/* Content */}
        <div className="relative z-10 max-w-lg space-y-8 text-white">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Sistema de Gestão</span>
            </div>

            <h1 className="text-5xl font-bold leading-tight tracking-tight">
              Fortaleza System<span className="block mt-2 text-white/90"></span>
            </h1>

            <p className="text-lg text-white/80 leading-relaxed">
              Controle completo de estoque e clientes.
            </p>

          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-2 gap-4 pt-8">
            {[
              { label: "Gestão de Estoque", value: "Eficiente" },
              { label: "Controle de Clientes", value: "Inteligente" },
              // { label: "Relatórios", value: "Detalhados" },
            ].map((item, i) => (
              <div key={i} className="space-y-1 p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
                <p className="text-sm text-white/60">{item.label}</p>
                <p className="text-lg font-semibold">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Logo for mobile */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary">
              <Sparkles className="w-5 h-5" />
              <span className="font-semibold">Sistema de Gestão</span>
            </div>
          </div>

          {/* Header */}
          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight">Bem-vindo de volta</h2>
            <p className="text-muted-foreground">Entre com suas credenciais para continuar</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {/* Email field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email ou usuário
                </Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="seu@email.com"
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                  required
                  disabled={isLoading}
                  className="h-11 rounded-xl border-border/40 bg-background/50 backdrop-blur-sm transition-all duration-300 focus:bg-background focus:shadow-lg focus:shadow-primary/10"
                />
              </div>

              {/* Password field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Senha
                  </Label>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={visible ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="h-11 rounded-xl border-border/40 bg-background/50 backdrop-blur-sm transition-all duration-300 focus:bg-background focus:shadow-lg focus:shadow-primary/10"
                  />
                  <button
                    type="button"
                    onClick={handleToglePasswordVisibility}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {visible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive animate-in fade-in slide-in-from-top-1">
                {error}
              </div>
            )}

            {/* Submit button */}
            <Button
              type="submit"
              className="w-full h-12 text-base font-medium bg-primary hover:bg-primary/90 transition-all duration-200 group"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Entrando...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Entrar
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">ou</span>
              </div>
            </div>

            <div className="text-center relative z-10">
              <p className="text-sm text-muted-foreground">
                Não tem uma conta?{" "}
                <Link
                  href="/register"
                  className="font-semibold text-primary hover:underline underline-offset-4 transition-colors cursor-pointer inline-block">
                  Criar conta
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(20px) scale(0.95); }
        }
        
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 10s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
