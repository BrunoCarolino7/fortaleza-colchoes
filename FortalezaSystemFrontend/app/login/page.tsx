"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Package } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export default function LoginPage() {
  const [user, setUser] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleToglePasswordVisibility = () => {
    setVisible(!visible);
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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary">
            <Package className="h-6 w-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">Bem-vindo</CardTitle>
          <CardDescription>Entre com suas credenciais para acessar o sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={visible ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={handleToglePasswordVisibility}
                  className="
                    absolute inset-y-0 right-0 flex items-center pr-3
                    text-gray-500 hover:text-gray-700
                    transition-colors duration-200
                    cursor-pointer
                  "
                >
                  {visible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>

              </div>
            </div>

            {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}
            </div>}
            <Button
              type="submit"
              className="w-full hover:cursor-pointer transition-colors duration-200"
              disabled={isLoading}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
