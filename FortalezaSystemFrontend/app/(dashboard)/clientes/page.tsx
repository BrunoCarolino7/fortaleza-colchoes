"use client"

import { useState } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusIcon, SearchIcon, EyeIcon, PencilIcon, Trash2Icon } from "@/components/icons"
import { clientesIniciais } from "@/lib/data/clientes"

export default function ClientesPage() {
  const [clientes, setClientes] = useState(clientesIniciais)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredClientes = clientes.filter(
    (cliente) =>
      cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.cpf.includes(searchTerm) ||
      cliente.rg.includes(searchTerm),
  )

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este cliente?")) {
      setClientes(clientes.filter((c) => c.id !== id))
    }
  }

  return (
    <div className="flex flex-col">
      <Header title="Clientes" />
      <div className="flex-1 overflow-auto p-4 sm:p-6">
        <div className="mb-4 flex flex-col gap-4 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:w-64">
            <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar clientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Link href="/clientes/novo" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto">
              <PlusIcon className="mr-2 h-4 w-4" />
              Novo Cliente
            </Button>
          </Link>
        </div>

        <div className="hidden rounded-lg border border-border bg-card md:block">
          <Table>
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
              {filteredClientes.map((cliente) => (
                <TableRow key={cliente.id}>
                  <TableCell className="font-medium">{cliente.nome}</TableCell>
                  <TableCell>{cliente.cpf}</TableCell>
                  <TableCell>{cliente.rg}</TableCell>
                  <TableCell>{cliente.estadoCivil}</TableCell>
                  <TableCell>
                    {cliente.enderecos[0]?.cidade}, {cliente.enderecos[0]?.estado}
                  </TableCell>
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
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(cliente.id)}>
                        <Trash2Icon className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="space-y-4 md:hidden">
          {filteredClientes.map((cliente) => (
            <Card key={cliente.id}>
              <CardContent className="p-4">
                <div className="mb-3">
                  <h3 className="font-semibold text-lg">{cliente.nome}</h3>
                  <p className="text-sm text-muted-foreground">
                    {cliente.enderecos[0]?.cidade}, {cliente.enderecos[0]?.estado}
                  </p>
                </div>
                <div className="mb-3 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">CPF:</span> {cliente.cpf}
                  </div>
                  <div>
                    <span className="text-muted-foreground">RG:</span> {cliente.rg}
                  </div>
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Estado Civil:</span> {cliente.estadoCivil}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/clientes/${cliente.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      <EyeIcon className="mr-2 h-4 w-4" />
                      Ver
                    </Button>
                  </Link>
                  <Link href={`/clientes/${cliente.id}/editar`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      <PencilIcon className="mr-2 h-4 w-4" />
                      Editar
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(cliente.id)}>
                    <Trash2Icon className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
