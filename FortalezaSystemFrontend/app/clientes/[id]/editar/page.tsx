"use client"

import { use } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { ClienteForm } from "@/components/clientes/cliente-form"
import { clientesIniciais } from "@/lib/data/clientes"

export default function EditarClientePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const cliente = clientesIniciais.find((c) => c.id === id)

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
    // Aqui você atualizaria o cliente no estado global ou banco de dados
    router.push(`/clientes/${id}`)
  }

  return (
    <div>
      <Header title="Editar Cliente" />
      <div className="p-6">
        <ClienteForm cliente={cliente} onSubmit={handleSubmit} />
      </div>
    </div>
  )
}
