"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
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
} from "@/components/icons"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import axios from "axios"
import { useIsMobile } from "@/hooks/use-mobile"

interface Cliente {
  id: number
  nome: string
  estadoCivil?: string
  documento?: { cpf?: string; rg?: string }
  enderecos?: { cidade?: string; estado?: string }[]
}

interface ClienteResponse {
  data: Cliente[]
  totalItems: number
  page: number
  pageSize: number
  totalPages: number
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const isMobile = useIsMobile()

  const pageSize = 10

  const fetchClientes = async (page: number, search?: string) => {
    setLoading(true)
    try {
      const response = await axios.get<ClienteResponse>(
        `https://localhost:7195/api/cliente?page=${page}&pageSize=${pageSize}${search ? `&search=${encodeURIComponent(search)}` : ""
        }`
      )

      const result = response.data
      setClientes(result.data || [])
      setTotalPages(result.totalPages ?? Math.ceil((result.totalItems ?? 0) / pageSize))
      setTotalItems(result.totalItems ?? 0)
      setCurrentPage(result.page ?? page)
    } catch (error) {
      console.error(error)
      setClientes([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClientes(currentPage, searchTerm)
  }, [currentPage, searchTerm])

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1)
  }

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1)
  }

  const handleConfirmDelete = (id: number | null) => {
    setSelectedId(id)
    setOpenDialog(true)
  }

  const handleDelete = async () => {
    if (!selectedId) return
    console.log(`Cliente ${selectedId} excluído (simulação)`)
    setOpenDialog(false)
    fetchClientes(currentPage, searchTerm)
  }

  if (loading) {
    return (
      <div className="flex flex-col">
        <Header title="Clientes" />
        <div className="flex-1 overflow-auto p-4 sm:p-6">
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <Header title="Clientes" />
      <div className="flex-1 overflow-auto p-4 sm:p-6">
        {/* Header */}
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:w-64">
            <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Busque por nome, CPF ou RG"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              className="pl-8"
            />
          </div>

          <Link href="/clientes/novo" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto">
              <PlusIcon className="mr-2 h-4 w-4" /> Novo Cliente
            </Button>
          </Link>
        </div>

        {/* === MOBILE === */}
        {isMobile ? (
          <div className="flex flex-col gap-3">
            {clientes.map((cliente) => (
              <div
                key={cliente.id}
                className="border border-border rounded-lg p-4 bg-card shadow-sm flex flex-col gap-2"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-base font-semibold">{cliente.nome}</h2>
                  <div className="flex gap-2">
                    <Link href={`/clientes/${cliente.id}`}>
                      <Button variant="ghost" size="icon">
                        <EyeIcon className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/clientes/${cliente.id}/editar`}>
                      <Button variant="ghost" size="icon">
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleConfirmDelete(cliente.id)}
                    >
                      <Trash2Icon className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  <strong>CPF:</strong> {cliente.documento?.cpf ?? "-"}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>RG:</strong> {cliente.documento?.rg ?? "-"}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Estado Civil:</strong> {cliente.estadoCivil ?? "-"}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Cidade:</strong> {cliente.enderecos?.[0]?.cidade ?? "-"}
                </p>
              </div>
            ))}

            {/* Paginação MOBILE */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center p-4 text-sm text-muted-foreground">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevious}
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>
                <span>
                  Página {currentPage} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                >
                  Próxima
                </Button>
              </div>
            )}
          </div>
        ) : (
          /* === DESKTOP === */
          <div className="hidden rounded-lg border border-border bg-card md:block">
            {clientes.length > 0 ? (
              <>
                <Table className="table-fixed w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>CPF</TableHead>
                      <TableHead>RG</TableHead>
                      <TableHead>Estado Civil</TableHead>
                      <TableHead>Cidade</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clientes.map((cliente) => (
                      <TableRow key={cliente.id}>
                        <TableCell>{cliente.nome}</TableCell>
                        <TableCell>{cliente.documento?.cpf ?? "-"}</TableCell>
                        <TableCell>{cliente.documento?.rg ?? "-"}</TableCell>
                        <TableCell>{cliente.estadoCivil ?? "-"}</TableCell>
                        <TableCell>{cliente.enderecos?.[0]?.cidade ?? "-"}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Link href={`/clientes/${cliente.id}`}>
                              <Button variant="ghost" size="icon">
                                <EyeIcon className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link href={`/clientes/${cliente.id}/editar`}>
                              <Button variant="ghost" size="icon">
                                <PencilIcon className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleConfirmDelete(cliente.id)}
                            >
                              <Trash2Icon className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="flex justify-between items-center p-4 border-t text-sm text-muted-foreground">
                  <span>
                    Página {currentPage} de {totalPages} — {totalItems} clientes no total
                  </span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handlePrevious} disabled={currentPage === 1}>
                      Anterior
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleNext} disabled={currentPage === totalPages}>
                      Próxima
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-20 text-muted-foreground">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/748/748122.png"
                  alt="Sem clientes"
                  className="w-20 h-20 mx-auto mb-3 opacity-70"
                />
                <p className="text-sm font-medium mb-1">Nenhum cliente encontrado</p>
                <p className="text-xs mb-4">Cadastre um cliente para começar a gerenciar.</p>
                <Link href="/clientes/novo">
                  <Button size="sm">
                    <PlusIcon className="mr-2 h-4 w-4" /> Adicionar Cliente
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL CONFIRMAR EXCLUSÃO */}
      <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este cliente? Essa ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
