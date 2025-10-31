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
  const api = process.env.NEXT_PUBLIC_API

  useEffect(() => {
    if (!id) return

    const fetchProduto = async () => {
      try {
        const response = await fetch(`${api}/estoque/produto/${Number(id)}`)
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
        <div className="rounded-2xl border border-border/40 bg-card/50 p-12 text-center backdrop-blur-sm">
          <p className="text-destructive">{error}</p>
        </div>
      </div>
    )
  }

  if (!produto) {
    return (
      <div>
        <Header title="Produto não encontrado" />
        <div className="rounded-2xl border border-border/40 bg-card/50 p-12 text-center backdrop-blur-sm">
          <p className="text-muted-foreground">Produto não encontrado.</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Header title="Detalhes do Produto" />
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/estoque">
            <Button variant="ghost" size="icon" className="h-11 w-11 rounded-xl hover:bg-accent/10">
              <ArrowLeftIcon className="h-5 w-5" />
            </Button>
          </Link>
          <Link href={`/estoque/${id}/editar`}>
            <Button className="group h-11 rounded-xl bg-gradient-to-r from-primary to-accent shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <PencilIcon className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
              Editar
            </Button>
          </Link>
        </div>

        <Card className="overflow-hidden rounded-2xl border-border/40 bg-card/50 backdrop-blur-sm shadow-xl">
          <CardHeader className="border-b border-border/40 bg-gradient-to-r from-primary/5 to-accent/5">
            <div className="flex items-start justify-between">
              <CardTitle className="font-heading text-2xl">{produto.nome}</CardTitle>
              {getEstoqueStatus(produto)}
            </div>
          </CardHeader>

          <CardContent className="space-y-4 p-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Categoria</p>
                <p className="font-heading text-lg font-semibold text-foreground">{produto.categoria}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Tamanho</p>
                <p className="font-heading text-lg font-semibold text-foreground">{produto.tamanho}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Preço</p>
                <p className="font-heading text-2xl font-bold text-gradient">
                  {produto.preco?.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Quantidade em Estoque</p>
                <p className="font-heading text-2xl font-bold text-foreground">{produto.quantidade} unidades</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
