"use client"

import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UsersIcon, PackageIcon } from "@/components/icons"
import axios, { type AxiosError } from "axios"
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import type { AxiosErrorInfo, EstoqueTotalAgregado } from "@/app/interfaces/geral"

export default function DashboardPage() {
  const [totalClientes, setTotalClientes] = useState<number | null>(null)
  const [totalEstoque, setTotalEstoque] = useState<EstoqueTotalAgregado | null>(null)
  const [errorClientes, setErrorClientes] = useState<AxiosErrorInfo | null>(null)
  const [errorEstoque, setErrorEstoque] = useState<AxiosErrorInfo | null>(null)
  const api = process.env.NEXT_PUBLIC_API

  useEffect(() => {
    axios
      .get(`${api}/cliente/count`)
      .then((response) => setTotalClientes(response.data))
      .catch((err: AxiosError) => {
        const errorInfo: AxiosErrorInfo = {
          status: err.response?.status,
          message: err.message,
          name: err.name,
          code: err.code,
          stack: err.stack,
        }
        setErrorClientes(errorInfo)
      })

    axios
      .get(`${api}/estoque`)
      .then((response) => setTotalEstoque(response.data))
      .catch((err: AxiosError) => {
        const errorInfo: AxiosErrorInfo = {
          status: err.response?.status,
          message: err.message,
          name: err.name,
          code: err.code,
          stack: err.stack,
        }
        setErrorEstoque(errorInfo)
      })
  }, [])

  const stats = [
    {
      title: "Total de Clientes",
      value:
        errorClientes?.status === 404 || totalClientes === null ? (
          "0"
        ) : totalClientes !== null ? (
          totalClientes.toString()
        ) : (
          <Skeleton className="h-6 w-12 rounded" />
        ),
      icon: UsersIcon,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-500/10 to-cyan-500/10",
    },
    {
      title: "Produtos em Estoque",
      value:
        errorEstoque?.status === 404 || totalEstoque === null ? (
          "0"
        ) : totalEstoque !== null ? (
          totalEstoque.total
        ) : (
          <Skeleton className="h-6 w-12 rounded" />
        ),
      icon: PackageIcon,
      trend:
        totalEstoque && (totalEstoque.baixoEstoque > 0 || totalEstoque.semEstoque > 0)
          ? `Baixo: ${totalEstoque.baixoEstoque} • Sem: ${totalEstoque.semEstoque}`
          : undefined,
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-500/10 to-pink-500/10",
    },
  ]

  return (
    <div className="flex flex-col">
      <Header title="Painel de Controle" />

      <div className="flex-1 overflow-auto scrollbar-thin">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {stats.map((stat, index) => (
            <Card
              key={stat.title}
              className="group relative overflow-hidden border-border/40 bg-card/50 backdrop-blur-sm transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/10"
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
              }}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
              />

              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-20" />

              <CardHeader className="relative flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
                  {stat.title}
                </CardTitle>
                <div
                  className={`rounded-xl bg-gradient-to-br ${stat.gradient} p-3 shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:shadow-xl`}
                >
                  {stat.icon({ className: "h-5 w-5 text-white" })}
                </div>
              </CardHeader>

              <CardContent className="relative">
                <div className="font-heading text-4xl font-bold tracking-tight text-foreground transition-all duration-300 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-primary group-hover:to-accent">
                  {stat.value}
                </div>
                {stat.trend && (
                  <div className="mt-3 flex items-center gap-2">
                    <div className={`h-1.5 w-1.5 rounded-full bg-gradient-to-r ${stat.gradient} animate-pulse`} />
                    <p className="text-xs font-medium text-muted-foreground">{stat.trend}</p>
                  </div>
                )}
              </CardContent>

              <div
                className={`absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${stat.gradient} opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-20`}
              />
            </Card>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-border/40 bg-gradient-to-br from-card/80 to-card/40 p-8 backdrop-blur-sm shadow-xl">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-heading text-2xl font-bold text-foreground">Bem-vindo ao Sistema Fortaleza</h3>
              <p className="mt-2 text-muted-foreground max-w-2xl">
                Gerencie seus clientes, estoque e pedidos de forma eficiente e moderna.
              </p>
            </div>
            <div className="hidden lg:block">
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary to-accent opacity-20 blur-2xl" />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
