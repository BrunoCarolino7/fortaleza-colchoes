"use client"

import { use, useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeftIcon, PencilIcon, AlertTriangleIcon } from "@/components/icons"
import Link from "next/link"

export default function ProdutoDetalhesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [produto, setProduto] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    const fetchProduto = async () => {
      try {
        const response = await fetch(`https://localhost:7195/api/estoque/produto/${Number(id)}`)
        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`)
        const result = await response.json()
        const produtoData = result.data ?? result
        console.log("Produto carregado:", produtoData)
        setProduto(produtoData)
      } catch (err: any) {
        console.error("Erro ao carregar produto:", err)
        setError("Erro ao carregar os dados do produto.")
      } finally {
        setLoading(false)
      }
    }

    fetchProduto()
  }, [id])

  const getEstoqueStatus = (produto: any) => {
    if (!produto || produto.statusEstoque == null) return null

    switch (produto.statusEstoque) {
      case 1:
        return (
          <Badge variant="outline" className="border-green-500 text-green-600">
            Em Estoque
          </Badge>
        )
      case 2:
        return (
          <Badge variant="outline" className="border-yellow-500 text-yellow-600">
            <AlertTriangleIcon className="mr-1 h-3 w-3" />
            Estoque Baixo
          </Badge>
        )
      case 3:
        return <Badge variant="destructive">Sem Estoque</Badge>
      default:
        return (
          <Badge variant="outline" className="border-gray-400 text-gray-500">
            Desconhecido
          </Badge>
        )
    }
  }

  if (loading) {
    return (
      <div>
        <Header title="Carregando..." />
        <div className="p-6 text-muted-foreground">Carregando produto...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <Header title="Erro" />
        <div className="p-6 text-destructive">{error}</div>
      </div>
    )
  }

  if (!produto) {
    return (
      <div>
        <Header title="Produto não encontrado" />
        <div className="p-6 text-muted-foreground">
          <p>Produto não encontrado.</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Header title="Detalhes do Produto" />
      <div className="p-6">
        <div className="mb-4 flex items-center gap-2">
          <Link href="/estoque">
            <Button variant="ghost" size="icon">
              <ArrowLeftIcon className="h-4 w-4" />
            </Button>
          </Link>
          <Link href={`/estoque/${id}/editar`}>
            <Button>
              <PencilIcon className="mr-2 h-4 w-4" />
              Editar
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <CardTitle>{produto.nome}</CardTitle>
              {getEstoqueStatus(produto)}
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Categoria</p>
                <p className="text-sm">{produto.categoria}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tamanho</p>
                <p className="text-sm">{produto.tamanho}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Preço</p>
                <p className="text-sm">
                  {produto.preco?.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Quantidade em Estoque</p>
                <p className="text-sm">{produto.quantidade} unidades</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
