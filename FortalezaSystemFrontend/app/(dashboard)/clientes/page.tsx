"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusIcon, SearchIcon, EyeIcon, PencilIcon, Trash2Icon } from "@/components/icons"
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
  const api = process.env.NEXT_PUBLIC_API
  const pageSize = 10

  const fetchClientes = async () => {
    setLoading(true)
    try {
      const response = await axios.get<{ data: Cliente[] }>(`${api}/cliente?page=1&pageSize=9999`)
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
    const term = searchTerm.toLowerCase().trim()

    if (!term) {
      setFilteredClientes(clientes)
      setTotalPages(Math.max(1, Math.ceil(clientes.length / pageSize)))
      setCurrentPage(1)
      return
    }

    const hasNumbers = /\d/.test(term)
    const searchNum = term.replace(/\D/g, "")

    const filtrados = clientes.filter((c) => {
      const nome = c.nome?.toLowerCase() ?? ""
      const cpf = c.documento?.cpf?.replace(/\D/g, "") ?? ""

      if (hasNumbers) {
        return cpf.includes(searchNum)
      }

      return nome.includes(term)
    })

    setFilteredClientes(filtrados)
    setTotalPages(Math.max(1, Math.ceil(filtrados.length / pageSize)))
    setCurrentPage(1)
  }, [searchTerm, clientes])

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
      await axios.delete(`${api}/cliente/${selectedId}`)
      await fetchClientes()
      setOpenDialog(false)
    } catch (error) {
      console.error("Erro ao excluir cliente:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const paginatedClientes = filteredClientes.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  if (loading) {
    return (
      <div className="flex flex-col">
        <Header title="Clientes" />
        <div className="flex-1 overflow-auto">
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <Header title="Clientes" />
      <div className="flex-1 overflow-auto">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:w-80">
            <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Busque por nome ou CPF"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-11 rounded-xl border-border/40 bg-card/50 backdrop-blur-sm transition-all duration-300 focus:bg-card focus:shadow-lg focus:shadow-primary/10"
            />
          </div>

          <Link href="/clientes/novo" className="w-full sm:w-auto">
            <Button className="group w-full sm:w-auto h-11 rounded-xl bg-gradient-to-r from-primary to-accent shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/30">
              <PlusIcon className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:rotate-90" />
              Novo Cliente
            </Button>
          </Link>
        </div>

        {/* === MOBILE === */}
        {isMobile ? (
          <div className="flex flex-col gap-4">
            {paginatedClientes.map((cliente, index) => (
              <div
                key={cliente.id}
                className="group relative overflow-hidden rounded-2xl border border-border/40 bg-card/50 p-5 backdrop-blur-sm shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/10"
                style={{
                  animation: `fadeInUp 0.4s ease-out ${index * 0.05}s both`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="relative flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <h2 className="font-heading text-lg font-bold text-foreground">{cliente.nome}</h2>
                    <div className="flex gap-2">
                      <Link href={`/clientes/${cliente.id}`}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/clientes/${cliente.id}/editar`}>
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
                        onClick={() => handleConfirmDelete(cliente.id)}
                      >
                        <Trash2Icon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <p className="text-muted-foreground">
                      <strong className="text-foreground">CPF:</strong> {cliente.documento?.cpf ?? "-"}
                    </p>
                    <p className="text-muted-foreground">
                      <strong className="text-foreground">RG:</strong> {cliente.documento?.rg ?? "-"}
                    </p>
                    <p className="text-muted-foreground">
                      <strong className="text-foreground">Estado Civil:</strong> {cliente.estadoCivil ?? "-"}
                    </p>
                    <p className="text-muted-foreground">
                      <strong className="text-foreground">Cidade:</strong> {cliente.enderecos?.[0]?.cidade ?? "-"}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {paginatedClientes.length === 0 && (
              <div className="rounded-2xl border border-border/40 bg-card/50 p-12 text-center backdrop-blur-sm">
                <div className="mx-auto mb-4 h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <SearchIcon className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="font-heading text-lg font-semibold text-foreground">Nenhum cliente encontrado</p>
                <p className="mt-2 text-sm text-muted-foreground">Tente ajustar sua busca</p>
              </div>
            )}

            {/* Paginação MOBILE */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between rounded-2xl border border-border/40 bg-card/50 p-4 backdrop-blur-sm">
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
        ) : (
          /* === DESKTOP === */
          <div className="hidden overflow-hidden rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm shadow-xl md:block">
            {paginatedClientes.length > 0 ? (
              <>
                <Table className="w-full table-fixed">
                  <TableHeader>
                    <TableRow className="border-b border-border/40 bg-muted/30 hover:bg-muted/50">
                      <TableHead className="font-heading font-semibold">Nome</TableHead>
                      <TableHead className="font-heading font-semibold">Logradouro</TableHead>
                      <TableHead className="font-heading font-semibold">Bairro</TableHead>
                      <TableHead className="font-heading font-semibold">Cidade</TableHead>
                      <TableHead className="font-heading font-semibold">CEP</TableHead>
                      <TableHead className="font-heading font-semibold">CPF</TableHead>
                      <TableHead className="text-right font-heading font-semibold">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedClientes.map((cliente, index) => (
                      <TableRow
                        key={cliente.id}
                        className="group border-b border-border/20 transition-all duration-300 hover:bg-gradient-to-r hover:from-primary/5 hover:to-accent/5"
                        style={{
                          animation: `fadeInUp 0.3s ease-out ${index * 0.03}s both`,
                        }}
                      >
                        <TableCell className="font-medium">{cliente.nome}</TableCell>
                        <TableCell>
                          {cliente.enderecos?.[0]?.logradouro
                            ? `${cliente.enderecos[0].logradouro}${
                                cliente.enderecos[0].numero ? `, ${cliente.enderecos[0].numero}` : ""
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
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary"
                              >
                                <EyeIcon className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link href={`/clientes/${cliente.id}/editar`}>
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
                              onClick={() => handleConfirmDelete(cliente.id)}
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
                    Página {currentPage} de {totalPages} — {filteredClientes.length} clientes encontrados
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
                <p className="font-heading text-xl font-bold text-foreground mb-2">Nenhum cliente encontrado</p>
                <p className="mb-6 text-sm text-muted-foreground">Cadastre um cliente para começar a gerenciar.</p>
                <Link href="/clientes/novo">
                  <Button className="rounded-xl bg-gradient-to-r from-primary to-accent shadow-lg shadow-primary/25">
                    <PlusIcon className="mr-2 h-4 w-4" /> Adicionar Cliente
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
        <AlertDialogContent className="rounded-2xl border-border/40 bg-card/95 backdrop-blur-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-heading text-xl">Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Tem certeza que deseja excluir{" "}
              <strong className="text-foreground">
                {clientes.find((c) => c.id === selectedId)?.nome ?? "este cliente"}
              </strong>
              ? Essa ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="rounded-xl bg-gradient-to-r from-destructive to-red-600 text-white shadow-lg shadow-destructive/25 hover:shadow-xl"
            >
              {isLoading ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
