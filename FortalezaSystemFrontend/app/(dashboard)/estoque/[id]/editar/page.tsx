"use client"

import { use } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { ProdutoForm } from "@/components/estoque/produto-form"
import { produtosIniciais } from "@/lib/data/estoque"

export default function EditarProdutoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const produto = produtosIniciais.find((p) => p.id === id)

  if (!produto) {
    return (
      <div>
        <Header title="Produto não encontrado" />
        <div className="p-6">
          <p>Produto não encontrado.</p>
        </div>
      </div>
    )
  }

  const handleSubmit = (data: any) => {
    console.log("[v0] Produto atualizado:", { id, ...data })
    // Aqui você atualizaria o produto no estado global ou banco de dados
    router.push(`/estoque/${id}`)
  }

  return (
    <div>
      <Header title="Editar Produto" />
      <div className="p-6">
        <ProdutoForm produto={produto} onSubmit={handleSubmit} />
      </div>
    </div>
  )
}
