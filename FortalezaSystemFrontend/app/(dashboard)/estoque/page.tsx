"use client"

import { useState } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusIcon, SearchIcon, EyeIcon, PencilIcon, Trash2Icon, AlertTriangleIcon } from "@/components/icons"
import { produtosIniciais } from "@/lib/data/estoque"

export default function EstoquePage() {
  const [produtos, setProdutos] = useState(produtosIniciais)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredProdutos = produtos.filter(
    (produto) =>
      produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      produto.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
      produto.fornecedor.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      setProdutos(produtos.filter((p) => p.id !== id))
    }
  }

  const getEstoqueStatus = (quantidade: number, estoqueMinimo: number) => {
    if (quantidade === 0) {
      return <Badge variant="destructive">Sem Estoque</Badge>
    }
    if (quantidade <= estoqueMinimo) {
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
      <Header title="Controle de Estoque" />
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="relative w-64">
            <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Link href="/estoque/novo">
            <Button>
              <PlusIcon className="mr-2 h-4 w-4" />
              Novo Produto
            </Button>
          </Link>
        </div>

        <div className="rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Tamanho</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProdutos.map((produto) => (
                <TableRow key={produto.id}>
                  <TableCell className="font-medium">{produto.nome}</TableCell>
                  <TableCell>{produto.categoria}</TableCell>
                  <TableCell>{produto.tamanho}</TableCell>
                  <TableCell>
                    {produto.preco.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </TableCell>
                  <TableCell>{produto.quantidade} un.</TableCell>
                  <TableCell>{getEstoqueStatus(produto.quantidade, produto.estoqueMinimo)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/estoque/${produto.id}`}>
                        <Button variant="ghost" size="icon">
                          <EyeIcon className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/estoque/${produto.id}/editar`}>
                        <Button variant="ghost" size="icon">
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(produto.id)}>
                        <Trash2Icon className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
