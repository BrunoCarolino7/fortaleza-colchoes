"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"

interface AuthContextType {
  isAuthenticated: boolean
  token: string | null
  login: (usuario: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const savedToken = localStorage.getItem("auth_token")
    if (savedToken) {
      setToken(savedToken)
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  const login = async (usuario: string, password: string) => {
    try {
      const body = { User: usuario, Password: password }
      const response = await axios.post("https://localhost:7195/api/cliente/login", body)

      console.log("response.data", response.data)
      const data = await response.data;

      if (data.status === 200 && data.token) {
        const token = data.token
        setToken(token)
        setIsAuthenticated(true)

        localStorage.setItem("auth_token", token)

        // Set cookie with 7 days expiration
        const maxAge = 60 * 60 * 24 * 7 // 7 days in seconds
        document.cookie = `auth_token=${token}; path=/; max-age=${maxAge}; SameSite=Lax${process.env.NODE_ENV === "production" ? "; Secure" : ""}`

        return { success: true }
      }

      return { success: false, error: data.error || "Erro ao fazer login" }
    } catch (error) {
      console.error("Login error:", error)
      return { success: false, error: "Erro ao fazer login" }
    }
  }

  const logout = () => {
    setToken(null)
    setIsAuthenticated(false)

    localStorage.removeItem("auth_token")
    document.cookie = "auth_token=; path=/; max-age=0"

    router.push("/login")
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, login, logout, isLoading }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
