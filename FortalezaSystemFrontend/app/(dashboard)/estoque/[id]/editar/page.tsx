"use client"

import { use, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { ProdutoForm } from "@/components/estoque/produto-form"
import axios from "axios"

export default function EditarProdutoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const [produto, setProduto] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const api = process.env.NEXT_PUBLIC_API

  useEffect(() => {
    const fetchProduto = async () => {
      try {
        const response = await axios.get(`${api}/estoque/produto/${id}`)
        setProduto(response.data)
      } catch (error) {
        console.error("Erro ao carregar produto:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduto()
  }, [id])

  if (loading) {
    return (
      <div>
        <Header title="Carregando..." />
        <div className="p-6">Carregando produto...</div>
      </div>
    )
  }

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

  const handleSubmit = async (data: any) => {
    try {
      await axios.put(`${api}/estoque/${id}`, data)
      router.push(`/estoque`)
    } catch (error) {
      console.error("Erro ao atualizar produto:", error)
      alert("Erro ao salvar as alterações.")
    }
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
