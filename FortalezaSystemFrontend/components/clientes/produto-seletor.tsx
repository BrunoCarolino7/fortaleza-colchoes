"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Trash2Icon } from "@/components/icons"
import type { Produto } from "@/lib/data/estoque"
import type { ProdutoSelecionado } from "@/lib/data/clientes"
import { useFetch } from "@/hooks/use-request"
import { formatToBRL } from "@/lib/utils"

interface ProdutoSeletorProps {
  produtosSelecionados?: ProdutoSelecionado[]
  onChange: (produtos: ProdutoSelecionado[]) => void
}

export function ProdutoSeletor({ produtosSelecionados = [], onChange }: ProdutoSeletorProps) {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [produtoAtual, setProdutoAtual] = useState<Produto | null>(null)
  const [produtoSelecionadoId, setProdutoSelecionadoId] = useState<string>("")
  const api = process.env.NEXT_PUBLIC_API

  const { data, loading } = useFetch<any>(`${api}/estoque`)

  useEffect(() => {
    if (produtosSelecionados.length === 0) {
      setProdutoAtual(null)
      setProdutoSelecionadoId("")
    }
  }, [produtosSelecionados.length])

  useEffect(() => {
    if (data?.data) {
      setProdutos(data.data)
    }
  }, [data])

  const pickFallbackProduct = (
    removedId: string,
    novosSelecionados: ProdutoSelecionado[],
    todos: Produto[],
  ): Produto | null => {
    if (novosSelecionados.length > 0) {
      const id = novosSelecionados[0].id
      return todos.find((p) => p.id === id) ?? null
    }

    return todos.find((p) => p.id !== removedId) ?? null
  }

  const handleProdutoChange = (produtoId: string) => {
    const produto = produtos.find((p) => p.id === produtoId)
    if (!produto) return

    setProdutoAtual(produto)
    setProdutoSelecionadoId(produtoId)

    const jaExiste = produtosSelecionados.some((p) => p.id === produto.id)
    if (!jaExiste) {
      const novoProduto: ProdutoSelecionado = {
        id: produto.id,
        nome: produto.nome,
        preco: produto.preco,
        quantidade: produto.quantidade,
        quantidadeSelecionada: 1,
      }
      onChange([...produtosSelecionados, novoProduto])
    }
    setProdutoSelecionadoId("")
  }

  const handleRemoverProduto = (produtoId: string) => {
    const novosSelecionados = produtosSelecionados.filter((p) => p.id !== produtoId)
    onChange(novosSelecionados)

    if (novosSelecionados.length === 0) {
      setProdutoAtual(null)
      setProdutoSelecionadoId("")
      return
    }

    if (produtoAtual?.id === produtoId) {
      const fallback = pickFallbackProduct(produtoId, novosSelecionados, produtos)
      setProdutoAtual(fallback)
      setProdutoSelecionadoId(fallback?.id ?? "")
    }
  }

  const handleUpdateQuantidade = (produtoId: string, novaQuantidade: number) => {
    const novosSelecionados = produtosSelecionados.map((p) => {
      if (p.id === produtoId) {
        return { ...p, quantidadeSelecionada: Math.max(1, novaQuantidade) }
      }
      return p
    })
    onChange(novosSelecionados)
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Selecionar Produtos do Estoque</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="produto">Produto</Label>
            <Select value={produtoSelecionadoId} onValueChange={handleProdutoChange}>
              <SelectTrigger id="produto">
                <SelectValue placeholder={loading ? "Carregando..." : "Selecione um produto"} />
              </SelectTrigger>
              <SelectContent>
                {produtos.map((produto) => (
                  <SelectItem key={produto.id} value={produto.id}>
                    {produto.nome} - {formatToBRL(produto.preco.toFixed(2))}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {produtoAtual ? (
            <div className="space-y-4 border-t pt-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Nome do Produto</Label>
                  <Input value={produtoAtual.nome} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Categoria</Label>
                  <Input value={produtoAtual.categoria} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Tamanho</Label>
                  <Input value={produtoAtual.tamanho} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Preço Unitário</Label>
                  <Input value={formatToBRL(produtoAtual.preco)} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Quantidade em Estoque</Label>
                  <Input value={produtoAtual.quantidade} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Fornecedor</Label>
                  <Input value={produtoAtual.fornecedor} disabled />
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Selecione um produto para visualizar os detalhes
            </div>
          )}
        </CardContent>
      </Card>

      {produtosSelecionados.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Produtos Selecionados ({produtosSelecionados.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {produtosSelecionados.map((produto) => (
              <div
                key={produto.id}
                className="flex items-center justify-between gap-4 p-3 border rounded-lg bg-muted/50"
              >
                <div className="flex-1">
                  <p className="font-medium">{produto.nome}</p>
                  <p className="text-sm text-muted-foreground">{formatToBRL(produto.preco)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor={`qty-${produto.id}`} className="text-sm">
                    Qtd:
                  </Label>
                  <Input
                    id={`qty-${produto.id}`}
                    type="number"
                    min="1"
                    max={produto.quantidade}
                    value={produto.quantidadeSelecionada}
                    onChange={(e) => handleUpdateQuantidade(produto.id, Number(e.target.value))}
                    className="w-16"
                  />
                </div>
                <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoverProduto(produto.id)}>
                  <Trash2Icon className="h-4 w-4" />
                </Button>
              </div>
            ))}

            <div className="border-t pt-3 mt-3">
              <div className="flex justify-between items-center font-semibold">
                <span>Total:</span>
                <span className="text-lg">
                  {formatToBRL(produtosSelecionados.reduce((acc, p) => acc + p.preco * p.quantidadeSelecionada, 0))}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
