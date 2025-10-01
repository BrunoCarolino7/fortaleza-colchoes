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
    <div>
      <Header title="Novo Produto" />
      <div className="p-6">
        <ProdutoForm onSubmit={handleSubmit} />
      </div>
    </div>
  )
}
