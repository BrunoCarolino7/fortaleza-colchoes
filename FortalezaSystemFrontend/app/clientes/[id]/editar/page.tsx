"use client"

import { use, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { ClienteForm } from "@/components/clientes/cliente-form"
import { useFetch } from "@/hooks/use-request"
import { Cliente } from "@/lib/data/clientes"
import axios from "axios"
import { toast } from "@/hooks/use-toast"
export default function EditarClientePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const api = process.env.NEXT_PUBLIC_API

  const { data: cliente, loading, error } = useFetch<Cliente>(
    id ? `${api}/cliente/${id}` : "", { enabled: !!id }
  )

  if (loading) {
    return (
      <div>
        <Header title="Carregando..." />
        <div className="p-6">Carregando cliente...</div>
      </div>
    )
  }

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

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true)
    try {
      await axios.put(`${api}/cliente/${data.Id}`, data, {
        headers: { "Content-Type": "application/json" },
      })

      toast({
        title: "Cliente atualizado com sucesso!",
        variant: "default"
      })

      setIsSubmitting(false)

      router.push("/clientes")
    } catch (error) {
      console.error(error)
      toast({
        title: "Erro ao atualizar cliente",
        description: "Verifique os dados e tente novamente.",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }
  return (
    <div>
      <Header title="Editar Cliente" />
      <div className="p-6">
        <ClienteForm cliente={cliente} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  )
}
