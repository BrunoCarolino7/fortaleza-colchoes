"use client"

import { use } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { ClienteForm } from "@/components/clientes/cliente-form"
import { useFetch } from "@/hooks/use-request"
import { Cliente } from "@/lib/data/clientes"
export default function EditarClientePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()

  const { data: cliente, loading, error } = useFetch<Cliente>(
    id ? `https://localhost:7195/api/cliente/${id}` : "", { enabled: !!id }
  )

  if (!cliente) {
    return (
      <div>
        <Header title="Cliente não encontrado" />
        <div className="p-6">
          <p>Cliente não encontrado.</p>
        </div>
      </div>
    )
  }

  const handleSubmit = (data: any) => {
    console.log("[v0] Cliente atualizado:", { id, ...data })
    router.push(`/clientes/${id}`)
  }
  console.log("Cliente:", cliente)

  return (
    <div>
      <Header title="Editar Cliente" />
      <div className="p-6">
        <ClienteForm cliente={cliente} onSubmit={handleSubmit} />
      </div>
    </div>
  )
}
