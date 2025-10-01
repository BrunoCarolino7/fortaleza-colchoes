"use client"

import { use } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PencilIcon, ArrowLeftIcon, AlertTriangleIcon } from "@/components/icons"
import { produtosIniciais } from "@/lib/data/estoque"

export default function ProdutoDetalhesPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
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

  const getEstoqueStatus = () => {
    if (produto.quantidade === 0) {
      return <Badge variant="destructive">Sem Estoque</Badge>
    }
    if (produto.quantidade <= produto.estoqueMinimo) {
      return (
        <Badge variant="outline" className="border-yellow-500 text-yellow-600">
          <AlertTriangleIcon className="mr-1 h-3 w-3" />
          Estoque Baixo
        </Badge>
      )
    }
    return (
      <Badge variant="outline" className="border-green-500 text-green-600">
        Em Estoque
      </Badge>
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
              {getEstoqueStatus()}
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
                  {produto.preco.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Fornecedor</p>
                <p className="text-sm">{produto.fornecedor}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Quantidade em Estoque</p>
                <p className="text-sm">{produto.quantidade} unidades</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Estoque Mínimo</p>
                <p className="text-sm">{produto.estoqueMinimo} unidades</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Data de Cadastro</p>
                <p className="text-sm">{new Date(produto.dataCadastro).toLocaleDateString("pt-BR")}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm font-medium text-muted-foreground">Descrição</p>
                <p className="text-sm">{produto.descricao}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
