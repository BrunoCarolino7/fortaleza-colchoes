"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { PlusIcon, SearchIcon, EyeIcon, PencilIcon, Trash2Icon, AlertTriangleIcon } from "@/components/icons"
import axios from "axios"
import { useIsMobile } from "@/hooks/use-mobile"

interface EstoqueItem {
  id: number
  nome: string
  categoria: string
  tamanho: string
  preco: number
  quantidade: number
  statusEstoque: number
}

export default function EstoquePage() {
  const [produtos, setProdutos] = useState<EstoqueItem[]>([])
  const [filteredProdutos, setFilteredProdutos] = useState<EstoqueItem[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const isMobile = useIsMobile()
  const api = process.env.NEXT_PUBLIC_API
  const pageSize = 10

  const fetchProdutos = async () => {
    setLoading(true)
    try {
      const response = await axios.get<{ data: EstoqueItem[] }>(`${api}/estoque?page=1&pageSize=9999`)
      const all = response.data.data || []
      setProdutos(all)
      setFilteredProdutos(all)
      setTotalPages(Math.ceil(all.length / pageSize))
    } catch (error) {
      console.error("Erro ao buscar estoque:", error)
      setProdutos([])
      setFilteredProdutos([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProdutos()
  }, [])

  useEffect(() => {
    const term = searchTerm.toLowerCase().trim()
    if (!term) {
      setFilteredProdutos(produtos)
      setTotalPages(Math.max(1, Math.ceil(produtos.length / pageSize)))
      setCurrentPage(1)
      return
    }

    const filtrados = produtos.filter((p) => p.nome.toLowerCase().includes(term))
    setFilteredProdutos(filtrados)
    setTotalPages(Math.max(1, Math.ceil(filtrados.length / pageSize)))
    setCurrentPage(1)
  }, [searchTerm, produtos])

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1)
  }

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1)
  }

  const getEstoqueStatus = (statusEstoque: number) => {
    switch (statusEstoque) {
      case 3:
        return <Badge variant="destructive">Sem Estoque</Badge>
      case 2:
        return (
          <Badge variant="outline" className="border-yellow-500 text-yellow-600">
            <AlertTriangleIcon className="mr-1 h-3 w-3" /> Estoque Baixo
          </Badge>
        )
      case 1:
      default:
        return (
          <Badge variant="outline" className="border-green-500 text-green-600">
            Em Estoque
          </Badge>
        )
    }
  }

  const handleRemoveItem = async (itemId: number) => {
    try {
      await axios.delete(`${api}/estoque/${itemId}`)
      setProdutos((prev) => prev.filter((item) => item.id !== itemId))
    } catch (error) {
      console.error("Erro ao remover produto:", error)
    }
  }

  const paginatedProdutos = filteredProdutos.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  if (loading) {
    return (
      <div className="flex flex-col">
        <Header title="Estoque" />
        <div className="flex-1 overflow-auto">
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <Header title="Estoque" />
      <div className="flex-1 overflow-auto">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:w-80">
            <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Busque por nome"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-11 rounded-xl border-border/40 bg-card/50 backdrop-blur-sm transition-all duration-300 focus:bg-card focus:shadow-lg focus:shadow-primary/10"
            />
          </div>

          <Link href="/estoque/novo" className="w-full sm:w-auto">
            <Button className="group w-full sm:w-auto h-11 rounded-xl bg-gradient-to-r from-primary to-accent shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/30">
              <PlusIcon className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:rotate-90" />
              Adicionar Produto
            </Button>
          </Link>
        </div>

        {isMobile ? (
          <div className="flex flex-col gap-4">
            {paginatedProdutos.map((produto, index) => (
              <div
                key={produto.id}
                className="group relative overflow-hidden rounded-2xl border border-border/40 bg-card/50 p-5 backdrop-blur-sm shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/10"
                style={{
                  animation: `fadeInUp 0.4s ease-out ${index * 0.05}s both`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="relative flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <h2 className="font-heading text-lg font-bold text-foreground">{produto.nome}</h2>
                    <div className="flex gap-2">
                      <Link href={`/estoque/${produto.id}`}>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary">
                          <EyeIcon className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/estoque/${produto.id}/editar`}>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-accent/10 hover:text-accent">
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-xl hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => handleRemoveItem(produto.id)}
                      >
                        <Trash2Icon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <p className="text-muted-foreground">
                      <strong className="text-foreground">Categoria:</strong> {produto.categoria}
                    </p>
                    <p className="text-muted-foreground">
                      <strong className="text-foreground">Tamanho:</strong> {produto.tamanho}
                    </p>
                    <p className="text-muted-foreground">
                      <strong className="text-foreground">Preço:</strong>{" "}
                      {produto.preco.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </p>
                    <p className="text-muted-foreground">
                      <strong className="text-foreground">Quantidade:</strong> {produto.quantidade} un.
                    </p>
                    <p className="text-muted-foreground">
                      <strong className="text-foreground">Status:</strong> {getEstoqueStatus(produto.statusEstoque)}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {paginatedProdutos.length === 0 && (
              <div className="rounded-2xl border border-border/40 bg-card/50 p-12 text-center backdrop-blur-sm">
                <div className="mx-auto mb-4 h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <SearchIcon className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="font-heading text-lg font-semibold text-foreground">Nenhum produto encontrado</p>
                <p className="mt-2 text-sm text-muted-foreground">Tente ajustar sua busca</p>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden shadow-lg">
            <table className="w-full text-sm">
              <thead className="bg-muted/40">
                <tr>
                  <th className="p-4 text-left">Nome</th>
                  <th className="p-4 text-left">Categoria</th>
                  <th className="p-4 text-left">Tamanho</th>
                  <th className="p-4 text-left">Preço</th>
                  <th className="p-4 text-left">Quantidade</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {paginatedProdutos.map((produto) => (
                  <tr key={produto.id} className="border-t hover:bg-muted/20 transition-colors">
                    <td className="p-4 font-medium">{produto.nome}</td>
                    <td className="p-4">{produto.categoria}</td>
                    <td className="p-4">{produto.tamanho}</td>
                    <td className="p-4">
                      {produto.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </td>
                    <td className="p-4">{produto.quantidade}</td>
                    <td className="p-4">{getEstoqueStatus(produto.statusEstoque)}</td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/estoque/${produto.id}`}>
                          <Button variant="ghost" size="icon" className="hover:text-primary">
                            <EyeIcon className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/estoque/${produto.id}/editar`}>
                          <Button variant="ghost" size="icon" className="hover:text-accent">
                            <PencilIcon className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="icon" className="hover:text-destructive" onClick={() => handleRemoveItem(produto.id)}>
                          <Trash2Icon className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {paginatedProdutos.length === 0 && (
              <div className="p-12 text-center">
                <div className="mx-auto mb-4 h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <SearchIcon className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="font-heading text-lg font-semibold text-foreground">Nenhum produto encontrado</p>
                <p className="mt-2 text-sm text-muted-foreground">Tente ajustar sua busca</p>
              </div>
            )}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between rounded-2xl border border-border/40 bg-card/50 p-4 backdrop-blur-sm">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className="rounded-xl bg-transparent"
            >
              Anterior
            </Button>
            <span className="text-sm font-medium text-muted-foreground">
              Página {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="rounded-xl bg-transparent"
            >
              Próxima
            </Button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
