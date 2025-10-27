"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { PlusIcon, Trash2Icon } from "@/components/icons"
import type { Produto } from "@/lib/data/estoque"
import type { ProdutoSelecionado } from "@/lib/data/clientes"
import { produtosIniciais } from "@/lib/data/estoque"

interface ProdutoSeletorProps {
  produtosSelecionados?: ProdutoSelecionado[]
  onChange: (produtos: ProdutoSelecionado[]) => void
}

export function ProdutoSeletor({ produtosSelecionados = [], onChange }: ProdutoSeletorProps) {
  const [produtos, setProdutos] = useState<Produto[]>(produtosIniciais)
  const [produtoAtual, setProdutoAtual] = useState<Produto | null>(null)
  const [produtoSelecionadoId, setProdutoSelecionadoId] = useState<string>("")

  const handleProdutoChange = (produtoId: string) => {
    const produto = produtos.find((p) => p.id === produtoId)
    if (produto) {
      setProdutoAtual(produto)
      setProdutoSelecionadoId(produtoId)
    }
  }

  const handleAdicionarProduto = () => {
    if (!produtoAtual) return

    // Verifica se o produto já foi selecionado
    const jaExiste = produtosSelecionados.some((p) => p.id === produtoAtual.id)
    if (jaExiste) {
      alert("Este produto já foi selecionado")
      return
    }

    const novoProduto: ProdutoSelecionado = {
      id: produtoAtual.id,
      nome: produtoAtual.nome,
      preco: produtoAtual.preco,
      quantidade: produtoAtual.quantidade,
    }

    onChange([...produtosSelecionados, novoProduto])
    setProdutoAtual(null)
    setProdutoSelecionadoId("")
  }

  const handleRemoverProduto = (produtoId: string) => {
    onChange(produtosSelecionados.filter((p) => p.id !== produtoId))
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
                <SelectValue placeholder="Selecione um produto" />
              </SelectTrigger>
              <SelectContent>
                {produtos.map((produto) => (
                  <SelectItem key={produto.id} value={produto.id}>
                    {produto.nome} - R$ {produto.preco.toFixed(2)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {produtoAtual && (
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
                  <Input value={`R$ ${produtoAtual.preco.toFixed(2)}`} disabled />
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
              <div className="space-y-2">
                <Label>Descrição</Label>
                <Input value={produtoAtual.descricao} disabled className="min-h-20" />
              </div>

              <Button type="button" onClick={handleAdicionarProduto} className="w-full sm:w-auto">
                <PlusIcon className="mr-2 h-4 w-4" />
                Adicionar Produto
              </Button>
            </div>
          )}

          {!produtoAtual && (
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
              <div key={produto.id} className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                <div className="flex-1">
                  <p className="font-medium">{produto.nome}</p>
                  <p className="text-sm text-muted-foreground">R$ {produto.preco.toFixed(2)}</p>
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
                  R$ {produtosSelecionados.reduce((acc, p) => acc + p.preco, 0).toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
