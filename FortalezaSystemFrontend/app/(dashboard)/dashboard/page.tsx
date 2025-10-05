"use client"

import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UsersIcon, PackageIcon, DollarSignIcon } from "@/components/icons"
import axios, { AxiosError } from "axios"
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"

enum StatusEstoqueEnum {
  EM_ESTOQUE = 1,
  BAIXO_ESTOQUE = 2,
  SEM_ESTOQUE = 3
}

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

    // Requisição de estoque
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

  console.log("Clientes", totalClientes)
  console.log("Estoque", totalEstoque)

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
        ) : totalEstoque.data !== null ? (
          totalEstoque.total
        ) : (
          <Skeleton className="h-6 w-12 rounded" />
        ),
      icon: PackageIcon,
      trend: totalEstoque?.baixoEstoque ? `Baixo estoque: ${totalEstoque.baixoEstoque}` : undefined,
    },
    {
      title: "Vendas do Mês",
      value: "R$ 45.231",
      icon: DollarSignIcon,
    },
  ]

  return (
    <div className="flex flex-col">
      <Header title="Dashboard" />
      <div className="flex-1 overflow-auto p-4 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                {stat.trend && (
                  <p className="text-xs text-muted-foreground">{stat.trend}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
