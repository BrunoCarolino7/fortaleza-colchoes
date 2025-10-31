"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Package } from "lucide-react"
import axios from "axios"
import Link from "next/link"

export default function RegisterPage() {
  const [usuario, setUsuario] = useState<string>("")
  const [senha, setSenha] = useState<string>("")
  const [confirmPassword, setConfirmPassword] = useState<string>("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [visibleConfirm, setVisibleConfirm] = useState(false)
  const router = useRouter()
  const api = process.env.NEXT_PUBLIC_API

  const handleTogglePasswordVisibility = () => {
    setVisible(!visible)
  }

  const handleToggleConfirmPasswordVisibility = () => {
    setVisibleConfirm(!visibleConfirm)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (senha !== confirmPassword) {
      setError("As senhas não coincidem")
      return
    }

    if (senha.length < 4) {
      setError("A senha deve ter pelo menos 4 caracteres")
      return
    }

    setIsLoading(true)

    try {
      const response = await axios.put(`${api}/cliente/cadastrar?usuario=${usuario}&senha=${senha}`)
      const data = await response;

      console.log("Response data:", response)
      if (data.status === 200) {
        router.push("/login?registered=true")
      } else {
        setError(data.status.toString())
      }
    } catch (error) {
      console.error("Registration error:", error)
      setError("Erro ao criar conta.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 gradient-mesh opacity-30 animate-pulse" style={{ animationDuration: "8s" }} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />
      </div>

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div
          className="absolute -left-20 top-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl animate-pulse"
          style={{ animationDuration: "4s" }}
        />
        <div
          className="absolute -right-20 bottom-20 h-80 w-80 rounded-full bg-accent/20 blur-3xl animate-pulse"
          style={{ animationDuration: "6s", animationDelay: "1s" }}
        />
      </div>

      <Card className="w-full max-w-md overflow-hidden border-border/40 bg-card/80 backdrop-blur-xl shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />

        <CardHeader className="relative space-y-3 text-center">
          <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/25">
            <Package className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="font-heading text-3xl font-bold text-gradient">Criar Conta</CardTitle>
          <CardDescription className="text-base">Preencha os dados para criar sua conta no sistema</CardDescription>
        </CardHeader>

        <CardContent className="relative">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="user" className="font-medium">
                Usuário
              </Label>
              <Input
                id="user"
                type="text"
                placeholder="JohnDoe7"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                required
                disabled={isLoading}
                className="h-11 rounded-xl border-border/40 bg-background/50 backdrop-blur-sm transition-all duration-300 focus:bg-background focus:shadow-lg focus:shadow-primary/10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="font-medium">
                Senha
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={visible ? "text" : "password"}
                  placeholder="••••••••"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  disabled={isLoading}
                  className="h-11 rounded-xl border-border/40 bg-background/50 pr-11 backdrop-blur-sm transition-all duration-300 focus:bg-background focus:shadow-lg focus:shadow-primary/10"
                />
                <button
                  type="button"
                  onClick={handleTogglePasswordVisibility}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground transition-colors duration-200 hover:text-foreground"
                >
                  {visible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="font-medium">
                Confirmar Senha
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={visibleConfirm ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="h-11 rounded-xl border-border/40 bg-background/50 pr-11 backdrop-blur-sm transition-all duration-300 focus:bg-background focus:shadow-lg focus:shadow-primary/10"
                />
                <button
                  type="button"
                  onClick={handleToggleConfirmPasswordVisibility}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground transition-colors duration-200 hover:text-foreground"
                >
                  {visibleConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm font-medium text-destructive backdrop-blur-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="h-12 w-full rounded-xl bg-gradient-to-r from-primary to-accent font-semibold shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/30"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Criando conta...
                </span>
              ) : (
                "Criar Conta"
              )}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Já tem uma conta?{" "}
              <Link
                href="/login"
                className="font-semibold text-primary transition-colors duration-200 hover:text-accent hover:underline"
              >
                Fazer login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
