"use client"

import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UsersIcon, PackageIcon, DollarSignIcon } from "@/components/icons"
import axios from "axios"
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardPage() {
  const [totalClientes, setTotalClientes] = useState<number | null>(null)

  useEffect(() => {
    axios
      .get("https://localhost:7195/api/cliente/count")
      .then((response) => setTotalClientes(response.data))
      .catch((err) => console.error(err))
  }, [])


  const stats = [
    {
      title: "Total de Clientes",
      value: totalClientes !== null ? (
        totalClientes.toString()
      ) : (
        <Skeleton className="h-6 w-12 rounded" />
      ),
      icon: UsersIcon,
    },
    {
      title: "Produtos em Estoque",
      value: "156",
      icon: PackageIcon,
      trend: "23 unidades baixas",
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
