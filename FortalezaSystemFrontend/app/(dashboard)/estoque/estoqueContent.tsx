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
    const [totalPages, setTotalPages] = useState(1)
    const [currentPage, setCurrentPage] = useState(1)
    const [searchTerm, setSearchTerm] = useState("")
    const [loading, setLoading] = useState(true)
    const isMobile = useIsMobile()

    const pageSize = 10

    const fetchProdutos = async (page: number, search?: string) => {
        setLoading(true)
        try {
            const response = await axios.get<EstoqueResponse>(
                `https://localhost:7195/api/estoque?page=${page}&pageSize=${pageSize}${search ? `&search=${encodeURIComponent(search)}` : ""
                }`
            )
            setProdutos(response.data.data || [])
            setTotalPages(
                response.data.totalPages ??
                Math.ceil((response.data.total ?? 0) / pageSize)
            )
        } catch {
            setProdutos([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProdutos(currentPage, searchTerm)
    }, [currentPage, searchTerm])

    const handlePrevious = () => {
        if (currentPage > 1) setCurrentPage((prev) => prev - 1)
    }

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage((prev) => prev + 1)
    }

    const getEstoqueStatus = (quantidade: number, estoqueMinimo = 10) => {
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
        <div className="flex flex-col">
            <Header title="Estoque" />
            <div className="flex-1 overflow-auto p-4 sm:p-6">
                {/* Barra de busca e botão */}
                <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative w-full sm:w-64">
                        <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Busque por nome ou categoria"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value)
                                setCurrentPage(1)
                            }}
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

                {/* desktop */}
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
                        ) : produtos.length > 0 ? (
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
                                        {produtos.map((produto) => (
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
                                                <TableCell>{getEstoqueStatus(produto.quantidade)}</TableCell>
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
                                                        <Button variant="ghost" size="icon">
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
                                    <span>Página {currentPage} de {totalPages}</span>
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

                {/* mobile*/}
                {isMobile && (
                    <div className="flex flex-col gap-4">
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="p-4 border rounded-lg bg-card shadow-sm">
                                    <Skeleton className="h-4 w-1/2 mb-2" />
                                    <Skeleton className="h-4 w-1/3 mb-2" />
                                    <Skeleton className="h-4 w-1/4" />
                                </div>
                            ))
                        ) : produtos.length > 0 ? (
                            produtos.map((produto) => (
                                <div
                                    key={produto.id}
                                    className="p-4 border rounded-lg bg-card shadow-sm"
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="font-semibold">{produto.nome}</h3>
                                        {getEstoqueStatus(produto.quantidade)}
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {produto.categoria} • {produto.tamanho}
                                    </p>
                                    <p className="mt-1 font-medium">
                                        {produto.preco.toLocaleString("pt-BR", {
                                            style: "currency",
                                            currency: "BRL",
                                        })}
                                    </p>
                                    <div className="flex justify-between items-center mt-3">
                                        <span className="text-sm text-muted-foreground">
                                            {produto.quantidade} unidades
                                        </span>
                                        <div className="flex gap-2">
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
                                            <Button variant="ghost" size="icon">
                                                <Trash2Icon className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-20 text-muted-foreground">
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

                        {/* Paginação mobile */}
                        {!loading && produtos.length > 0 && (
                            <div className="flex justify-between items-center p-4 border-t text-sm text-muted-foreground">
                                <span>Página {currentPage} de {totalPages}</span>
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
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
