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
  enderecos?: {
    logradouro?: string
    numero?: string
    bairro?: string
    cidade?: string
    estado?: string
    cep?: string
  }[]
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [filteredClientes, setFilteredClientes] = useState<Cliente[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const isMobile = useIsMobile()

  const pageSize = 10

  const fetchClientes = async () => {
    setLoading(true)
    try {
      const response = await axios.get<{ data: Cliente[] }>(
        "https://localhost:7195/api/cliente?page=1&pageSize=9999"
      )
      const all = response.data.data || []
      setClientes(all)
      setFilteredClientes(all)
      setTotalPages(Math.ceil(all.length / pageSize))
    } catch (error) {
      console.error(error)
      setClientes([])
      setFilteredClientes([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClientes()
  }, [])

  useEffect(() => {
    const term = searchTerm.toLowerCase().trim();

    if (!term) {
      setFilteredClientes(clientes);
      setTotalPages(Math.max(1, Math.ceil(clientes.length / pageSize)));
      setCurrentPage(1);
      return;
    }

    const hasNumbers = /\d/.test(term);
    const searchNum = term.replace(/\D/g, "");

    const filtrados = clientes.filter((c) => {
      const nome = c.nome?.toLowerCase() ?? "";
      const cpf = c.documento?.cpf?.replace(/\D/g, "") ?? "";

      if (hasNumbers) {
        return cpf.includes(searchNum);
      }

      return nome.includes(term);
    });

    setFilteredClientes(filtrados);
    setTotalPages(Math.max(1, Math.ceil(filtrados.length / pageSize)));
    setCurrentPage(1);
  }, [searchTerm, clientes]);

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

    setIsLoading(true)
    try {
      await axios.delete(`https://localhost:7195/api/cliente/${selectedId}`)
      await fetchClientes()
      setOpenDialog(false)
    } catch (error) {
      console.error("Erro ao excluir cliente:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const paginatedClientes = filteredClientes.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

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
              placeholder="Busque por nome ou CPF "
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
            {paginatedClientes.map((cliente) => (
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

            {paginatedClientes.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                Nenhum cliente encontrado
              </div>
            )}

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
            {paginatedClientes.length > 0 ? (
              <>
                <Table className="table-fixed w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Logradouro</TableHead>
                      <TableHead>Bairro</TableHead>
                      <TableHead>Cidade</TableHead>
                      <TableHead>CEP</TableHead>
                      <TableHead>CPF</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedClientes.map((cliente) => (
                      <TableRow key={cliente.id}>
                        <TableCell>{cliente.nome}</TableCell>
                        <TableCell>
                          {cliente.enderecos?.[0]?.logradouro
                            ? `${cliente.enderecos[0].logradouro}${cliente.enderecos[0].numero
                              ? `, ${cliente.enderecos[0].numero}`
                              : ""
                            }`
                            : "-"}
                        </TableCell>
                        <TableCell>{cliente.enderecos?.[0]?.bairro ?? "-"}</TableCell>
                        <TableCell>{cliente.enderecos?.[0]?.cidade ?? "-"}</TableCell>
                        <TableCell>{cliente.enderecos?.[0]?.cep ?? "-"}</TableCell>
                        <TableCell>{cliente.documento?.cpf ?? "-"}</TableCell>
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
                    Página {currentPage} de {totalPages} — {filteredClientes.length}{" "}
                    clientes encontrados
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
              <div className="text-center py-20 text-muted-foreground">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/748/748122.png"
                  alt="Sem clientes"
                  className="w-20 h-20 mx-auto mb-3 opacity-70"
                />
                <p className="text-sm font-medium mb-1">Nenhum cliente encontrado</p>
                <p className="text-xs mb-4">
                  Cadastre um cliente para começar a gerenciar.
                </p>
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
              Tem certeza que deseja excluir{" "}
              <strong>
                {clientes.find((c) => c.id === selectedId)?.nome ?? "este cliente"}
              </strong>
              ? Essa ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">
              {isLoading ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
