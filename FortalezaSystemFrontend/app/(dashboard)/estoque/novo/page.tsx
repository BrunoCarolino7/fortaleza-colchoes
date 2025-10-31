"use client"

import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { ProdutoForm } from "@/components/estoque/produto-form"
import axios from "axios"

export default function NovoProdutoPage() {
  const router = useRouter()
  const api = process.env.NEXT_PUBLIC_API

  const handleSubmit = async (data: any) => {
    try {
      await axios.post(`${api}/estoque`, data)
      console.log("Produto salvo com sucesso!", data)
      router.push("/estoque")
    } catch (error) {
      console.error("Erro ao salvar produto:", error)
    }
  }

  return (
    <div className="flex h-full flex-col">
      <Header title="Novo Produto" />
      <div className="flex-1 overflow-auto">
        <div className="rounded-2xl border border-border/40 bg-card/50 p-6 backdrop-blur-sm shadow-xl">
          <ProdutoForm onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  )
}
