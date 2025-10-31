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
    <div className="flex flex-col h-full">
      <Header title="Novo Produto" />
      <div className="flex-1 overflow-auto p-4 sm:p-6">
        <ProdutoForm onSubmit={handleSubmit} />
      </div>
    </div>
  )
}
