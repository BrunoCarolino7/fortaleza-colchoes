"use client"

import axios from "axios"
import { useToast } from "@/hooks/use-toast"
import { useRouter, useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { NovoPedidoForm } from "@/components/pedidos/novo-pedido-form"
import { useState } from "react"

export default function NovoPedidoPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const clienteId = searchParams.get("clienteId")
  const api = process.env.NEXT_PUBLIC_API

  const toDateTime = (value: any) => {
    if (!value) return null
    const d = new Date(value)
    return isNaN(d.getTime()) ? null : d.toISOString()
  }

  const handleSubmit = async (formData: any) => {
    if (!clienteId) return

    setIsSubmitting(true)
    try {
      const body = formData.estoque.map((produto: any) => ({
        produtoId: Number.parseInt(produto.id),
        quantidade: Number(produto.quantidade),
        precoUnitario: Number(produto.preco),
        pagamento: formData.pagamento
          ? {
              valorTotal: Number(formData.pagamento.valorTotal),
              sinal: Number(formData.pagamento.sinal),
              dataInicio: toDateTime(formData.pagamento.dataInicio),
              numeroParcelas: Number(formData.pagamento.numeroParcelas),
              parcelas: formData.pagamento.parcelas?.map((p: any) => ({
                numero: Number(p.numero),
                valor: Number(p.valor),
                vencimento: toDateTime(p.vencimento),
                statusPagamento: p.statusPagamento?.toString() ?? null,
              })),
            }
          : null,
      }))

      await axios.post(`${api}/pedido/gather/cliente/${clienteId}`, body, {
        headers: { "Content-Type": "application/json" },
      })

      toast({ title: "Sucesso!", description: "Pedido criado com sucesso." })
      router.push(`/clientes/${clienteId}?tab=pedidos`)
    } catch (err) {
      console.error("Erro ao criar pedido:", err)
      toast({ title: "Erro!", description: "Falha ao criar pedido." })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!clienteId) {
    return (
      <div className="flex flex-col">
        <Header title="Novo Pedido" />
        <div className="flex-1 overflow-auto">
          <div className="rounded-2xl border border-border/40 bg-card/50 p-12 text-center backdrop-blur-sm shadow-xl">
            <div className="mx-auto mb-4 h-16 w-16 rounded-2xl bg-gradient-to-br from-destructive/20 to-red-500/20 flex items-center justify-center">
              <span className="text-3xl">⚠️</span>
            </div>
            <p className="font-heading text-lg font-semibold text-foreground">Cliente não especificado</p>
            <p className="mt-2 text-sm text-muted-foreground">Selecione um cliente para criar um pedido</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <Header title="Novo Pedido" />
      <div className="flex-1 overflow-auto">
        <div className="rounded-2xl border border-border/40 bg-card/50 p-6 backdrop-blur-sm shadow-xl">
          <NovoPedidoForm onSubmit={handleSubmit} isSubmitting={isSubmitting} clienteId={Number(clienteId)} />
        </div>
      </div>
    </div>
  )
}
