"use client"

import Link from "next/link"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PencilIcon, ArrowLeftIcon } from "@/components/icons"
import { clientesIniciais } from "@/lib/data/clientes"

export default function ClienteDetalhesPage({ params }: { params: { id: string } }) {
  const cliente = clientesIniciais.find((c) => c.id === params.id)

  if (!cliente) {
    return (
      <div className="flex flex-col">
        <Header title="Cliente não encontrado" />
        <div className="p-4 sm:p-6">
          <p>Cliente não encontrado.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <Header title="Detalhes do Cliente" />
      <div className="flex-1 overflow-auto p-4 sm:p-6">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
          <Link href="/clientes">
            <Button variant="ghost" size="icon">
              <ArrowLeftIcon className="h-4 w-4" />
            </Button>
          </Link>
          <Link href={`/clientes/${params.id}/editar`} className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto">
              <PencilIcon className="mr-2 h-4 w-4" />
              Editar
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="pessoal" className="space-y-4">
          <TabsList className="grid h-auto w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
            <TabsTrigger value="pessoal" className="text-xs sm:text-sm">
              Pessoal
            </TabsTrigger>
            <TabsTrigger value="enderecos" className="text-xs sm:text-sm">
              Endereços
            </TabsTrigger>
            <TabsTrigger value="profissional" className="text-xs sm:text-sm">
              Profissional
            </TabsTrigger>
            <TabsTrigger value="conjuge" className="text-xs sm:text-sm">
              Cônjuge
            </TabsTrigger>
            <TabsTrigger value="referencias" className="text-xs sm:text-sm">
              Referências
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pessoal">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">{cliente.nome}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2"></div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="enderecos">
            <div className="space-y-4">
              {cliente.enderecos.map((endereco, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-base">Endereço {index + 1}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="profissional">
            {cliente.dadosProfissionais ? (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Dados Profissionais</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2"></div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Endereço da Empresa</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2"></div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  Nenhum dado profissional cadastrado
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="conjuge">
            {cliente.conjuge ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Informações do Cônjuge</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2"></div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">Nenhum cônjuge cadastrado</CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="referencias">
            {cliente.referencias.length > 0 ? (
              <div className="space-y-4">
                {cliente.referencias.map((referencia, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-base">Referência {index + 1}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4"></CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  Nenhuma referência cadastrada
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
