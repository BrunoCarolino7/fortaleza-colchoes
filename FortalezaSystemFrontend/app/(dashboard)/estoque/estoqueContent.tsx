"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  PlusIcon,
  SearchIcon,
  EyeIcon,
  PencilIcon,
  Trash2Icon,
  AlertTriangleIcon,
} from "@/components/icons"
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

    const filtrados = produtos.filter((p) =>
      p.nome.toLowerCase().includes(term)
    )
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

  const paginatedProdutos = filteredProdutos.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  return (
    <div className="flex flex-col">
      <Header title="Estoque" />
      <div className="flex-1 overflow-auto p-4 sm:p-6">
        {/* Barra de busca e botão */}
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:w-64">
            <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Busque por nome"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
              disabled={loading}
            />
          </div>

          <Link href="/estoque/novo" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto">
              <PlusIcon className="mr-2 h-4 w-4" />
              Adicionar Produto
            </Button>
          </Link>
        </div>

        {/* Desktop */}
        {!isMobile && (
          <div className="hidden rounded-lg border border-border bg-card md:block">
            {loading ? (
              <div className="p-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4 mb-3">
                    <Skeleton className="h-4 w-[20%]" />
                    <Skeleton className="h-4 w-[15%]" />
                    <Skeleton className="h-4 w-[10%]" />
                    <Skeleton className="h-4 w-[15%]" />
                    <Skeleton className="h-4 w-[10%]" />
                    <Skeleton className="h-4 w-[15%]" />
                  </div>
                ))}
              </div>
            ) : paginatedProdutos.length > 0 ? (
              <>
                <Table className="table-fixed w-full">
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
                    {paginatedProdutos.map((produto) => (
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
                        <TableCell>{getEstoqueStatus(produto.statusEstoque)}</TableCell>
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
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveItem(produto.id)}
                            >
                              <Trash2Icon className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Paginação */}
                <div className="flex justify-between items-center p-4 border-t text-sm text-muted-foreground">
                  <span>
                    Página {currentPage} de {totalPages}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePrevious}
                      disabled={currentPage === 1}
                    >
                      Anterior
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNext}
                      disabled={currentPage === totalPages}
                    >
                      Próxima
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-10 text-center text-muted-foreground">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/748/748122.png"
                  alt="Sem produtos"
                  className="w-20 h-20 mx-auto mb-3 opacity-70"
                />
                <p className="text-sm font-medium mb-1">Nenhum produto cadastrado</p>
                <p className="text-xs mb-4">
                  Adicione seu primeiro produto para começar o controle de estoque.
                </p>
                <Link href="/estoque/novo">
                  <Button size="sm">
                    <PlusIcon className="mr-2 h-4 w-4" /> Adicionar Produto
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
