"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusIcon, SearchIcon, EyeIcon, PencilIcon, Trash2Icon, AlertTriangleIcon } from "@/components/icons"
import axios from "axios"
import { Skeleton } from "@/components/ui/skeleton"
import { useIsMobile } from "@/hooks/use-mobile"

interface EstoqueItem {
  id: number
  nome: string
  categoria: string
  tamanho: string
  preco: number
  quantidade: number
  statusEstoque: number // 1=Em Estoque, 2=Baixo Estoque, 3=Sem Estoque
}

interface EstoqueResponse {
  data: EstoqueItem[]
  total: number
  baixoEstoque: number
  emEstoque: number
  semEstoque: number
  page?: number
  pageSize?: number
  totalPages?: number
}

export default function EstoqueContent() {
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
      const response = await axios.get<EstoqueResponse>(`${api}/estoque?page=1&pageSize=9999`)
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
            <AlertTriangleIcon className="mr-1 h-3 w-3" />
            Estoque Baixo
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

  const handleRemoveItem = (itemId: number) => {
    axios.delete(`${api}estoque/${itemId}`)
    setProdutos(produtos.filter((item) => item.id !== itemId))
    console.log("remove item", itemId)
  }

  const paginatedProdutos = filteredProdutos.slice((currentPage - 1) * pageSize, currentPage * pageSize)

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
              disabled={loading}
            />
          </div>

          <Link href="/estoque/novo" className="w-full sm:w-auto">
            <Button className="group w-full sm:w-auto h-11 rounded-xl bg-gradient-to-r from-primary to-accent shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/30">
              <PlusIcon className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:rotate-90" />
              Adicionar Produto
            </Button>
          </Link>
        </div>

        {/* Desktop */}
        {!isMobile && (
          <div className="hidden overflow-hidden rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm shadow-xl md:block">
            {loading ? (
              <div className="p-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="mb-3 flex items-center gap-4">
                    <Skeleton className="h-4 w-[20%] rounded" />
                    <Skeleton className="h-4 w-[15%] rounded" />
                    <Skeleton className="h-4 w-[10%] rounded" />
                    <Skeleton className="h-4 w-[15%] rounded" />
                    <Skeleton className="h-4 w-[10%] rounded" />
                    <Skeleton className="h-4 w-[15%] rounded" />
                  </div>
                ))}
              </div>
            ) : paginatedProdutos.length > 0 ? (
              <>
                <Table className="w-full table-fixed">
                  <TableHeader>
                    <TableRow className="border-b border-border/40 bg-muted/30 hover:bg-muted/50">
                      <TableHead className="font-heading font-semibold">Produto</TableHead>
                      <TableHead className="font-heading font-semibold">Categoria</TableHead>
                      <TableHead className="font-heading font-semibold">Tamanho</TableHead>
                      <TableHead className="font-heading font-semibold">Preço</TableHead>
                      <TableHead className="font-heading font-semibold">Quantidade</TableHead>
                      <TableHead className="font-heading font-semibold">Status</TableHead>
                      <TableHead className="text-right font-heading font-semibold">Ações</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {paginatedProdutos.map((produto, index) => (
                      <TableRow
                        key={produto.id}
                        className="group border-b border-border/20 transition-all duration-300 hover:bg-gradient-to-r hover:from-primary/5 hover:to-accent/5"
                        style={{
                          animation: `fadeInUp 0.3s ease-out ${index * 0.03}s both`,
                        }}
                      >
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
                        <TableCell>{getEstoqueStatus(produto.statusEstoque)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Link href={`/estoque/${produto.id}`}>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary"
                              >
                                <EyeIcon className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link href={`/estoque/${produto.id}/editar`}>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 rounded-xl hover:bg-accent/10 hover:text-accent"
                              >
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
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="flex items-center justify-between border-t border-border/40 bg-muted/20 p-4 backdrop-blur-sm">
                  <span className="text-sm font-medium text-muted-foreground">
                    Página {currentPage} de {totalPages}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePrevious}
                      disabled={currentPage === 1}
                      className="rounded-xl bg-transparent"
                    >
                      Anterior
                    </Button>
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
                </div>
              </>
            ) : (
              <div className="py-20 text-center">
                <div className="mx-auto mb-6 h-20 w-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <SearchIcon className="h-10 w-10 text-muted-foreground" />
                </div>
                <p className="font-heading text-xl font-bold text-foreground mb-2">Nenhum produto cadastrado</p>
                <p className="mb-6 text-sm text-muted-foreground">
                  Adicione seu primeiro produto para começar o controle de estoque.
                </p>
                <Link href="/estoque/novo">
                  <Button className="rounded-xl bg-gradient-to-r from-primary to-accent shadow-lg shadow-primary/25">
                    <PlusIcon className="mr-2 h-4 w-4" /> Adicionar Produto
                  </Button>
                </Link>
              </div>
            )}
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
