"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProdutoSeletor } from "@/components/clientes/produto-seletor"
import { PagamentoForm } from "@/components/clientes/pagamento-form"

interface NovoPedidoFormProps {
  onSubmit: (data: any) => Promise<void>
  isSubmitting: boolean
  clienteId: number
}

export function NovoPedidoForm({ onSubmit, isSubmitting, clienteId }: NovoPedidoFormProps) {
  const [formData, setFormData] = useState({
    estoque: [],
    pagamento: null as any,
  })

  useEffect(() => {
    if (formData.estoque.length > 0 && !formData.pagamento) {
      const totalProdutos = formData.estoque.reduce(
        (acc, produto) => acc + produto.preco * produto.quantidadeSelecionada,
        0,
      )
      setFormData((prev) => ({
        ...prev,
        pagamento: {
          valorTotal: totalProdutos,
          sinal: 0,
          numeroParcelas: 1,
          dataInicio: new Date().toISOString().split("T")[0],
          parcelas: [],
        },
      }))
    }
  }, [formData.estoque])

  const handleProdutosChange = (produtos: any[]) => {
    setFormData((prev) => ({
      ...prev,
      estoque: produtos,
    }))
  }

  const handlePagamentoChange = (pagamento: any) => {
    setFormData((prev) => ({
      ...prev,
      pagamento,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.estoque.length === 0) {
      alert("Selecione pelo menos um produto")
      return
    }

    if (!formData.pagamento) {
      alert("Preencha os dados de pagamento")
      return
    }

    await onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Produtos</CardTitle>
        </CardHeader>
        <CardContent>
          <ProdutoSeletor onChange={handleProdutosChange} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pagamento</CardTitle>
        </CardHeader>
        <CardContent>
          <PagamentoForm
            pagamento={formData.pagamento}
            onChange={handlePagamentoChange}
            produtosSelecionados={formData.estoque}
          />
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Criando..." : "Criar Pedido"}
        </Button>
      </div>
    </form>
  )
}
