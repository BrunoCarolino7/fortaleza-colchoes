"use client"

import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UsersIcon, PackageIcon, DollarSignIcon } from "@/components/icons"
import axios, { type AxiosError } from "axios"
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { AxiosErrorInfo, EstoqueTotalAgregado } from "@/app/interfaces/geral"


export default function DashboardPage() {
  const [totalClientes, setTotalClientes] = useState<number | null>(null)
  const [totalEstoque, setTotalEstoque] = useState<EstoqueTotalAgregado | null>(null)
  const [errorClientes, setErrorClientes] = useState<AxiosErrorInfo | null>(null)
  const [errorEstoque, setErrorEstoque] = useState<AxiosErrorInfo | null>(null)

  useEffect(() => {
    axios
      .get("https://localhost:7195/api/cliente/count")
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
      .get("https://localhost:7195/api/estoque")
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
  },
]


  return (
    <div className="flex flex-col">
      <Header title="Painel de Controle" />
      <div className="flex-1 overflow-auto bg-background p-6 scrollbar-thin">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {stats.map((stat) => (
            <Card key={stat.title} className="transition-all duration-200 hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <div className="rounded-lg bg-primary/10 p-2">{stat.icon({ className: "h-5 w-5 text-primary" })}</div>
              </CardHeader>
              <CardContent>
                <div className="font-heading text-3xl font-bold tracking-tight">{stat.value}</div>
                {stat.trend && <p className="mt-2 text-xs text-muted-foreground">{stat.trend}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
