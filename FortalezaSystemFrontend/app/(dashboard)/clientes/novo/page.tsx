"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { ClienteFormStepper } from "@/components/clientes/cliente-form-stepper"
import type { Cliente } from "@/lib/data/clientes"
import { useToast } from "@/hooks/use-toast"

export default function NovoClientePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (data: Omit<Cliente, "id" | "dataCadastro">) => {
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/clientes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Erro ao criar cliente")
      }

      toast({
        title: "Sucesso!",
        description: "Cliente criado com sucesso.",
      })

      router.push("/clientes")
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível criar o cliente. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col">
      <Header title="Novo Cliente" />
      <div className="flex-1 overflow-auto p-4 sm:p-6">
        <ClienteFormStepper onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  )
}
