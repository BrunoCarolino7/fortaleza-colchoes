"use client"

import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { ProdutoForm } from "@/components/estoque/produto-form"

export default function NovoProdutoPage() {
  const router = useRouter()

  const handleSubmit = (data: any) => {
    console.log("[v0] Novo produto:", data)
    // Aqui você adicionaria o produto ao estado global ou banco de dados
    router.push("/estoque")
  }

  return (
    <div className="flex flex-col h-full">
      <Header title="Novo Produto" />
      <div className="flex-1 overflow-auto p-4 sm:p-6">
        <ProdutoForm onSubmit={handleSubmit} />
      </div>
    </div>
  )
}
