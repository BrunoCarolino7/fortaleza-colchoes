"use client"

import { useEffect, useState } from "react"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PencilIcon, ArrowLeftIcon } from "@/components/icons"
import { Skeleton } from "@/components/ui/skeleton"
import { useFetch } from "@/hooks/use-request"
import type { Cliente } from "@/app/interfaces/geral"
import { formatCEP, formatCPF, formatDateBR, formatPhoneNumber, formatRG, formatToBRL } from "@/lib/utils"
import { PedidosTab } from "@/components/clientes/pedidos-tab"

export default function ClienteDetalhesPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string | null>(null)
  const api = process.env.NEXT_PUBLIC_API

  useEffect(() => {
    params.then((p) => setId(p.id))
  }, [params])

  const { data: cliente, loading, error } = useFetch<Cliente>(id ? `${api}/cliente/${id}` : "", { enabled: !!id })

  if (!id || loading) {
    return (
      <div className="flex flex-col">
        <Header title="Carregando Cliente..." />
        <div className="flex-1 overflow-auto">
          <Skeleton className="h-10 mb-4 w-40 rounded-xl" />
          <Skeleton className="mb-2 h-4 w-2/3 rounded" />
          <Skeleton className="mb-2 h-4 w-1/2 rounded" />
          <Skeleton className="h-4 w-1/3 rounded" />
        </div>
      </div>
    )
  }

  if (id === "novo") {
    redirect("/clientes/novo")
  }

  if (error || !cliente) {
    return (
      <div className="flex flex-col">
        <Header title="Cliente não encontrado" />
        <div className="rounded-2xl border border-border/40 bg-card/50 p-12 text-center backdrop-blur-sm">
          <p className="text-muted-foreground">Cliente não encontrado.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <Header title="Detalhes do Cliente" />
      <div className="flex-1 overflow-auto space-y-6">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link href="/clientes">
            <Button variant="ghost" size="icon" className="h-11 w-11 rounded-xl hover:bg-accent/10">
              <ArrowLeftIcon className="h-5 w-5" />
            </Button>
          </Link>
          <Link href={`/clientes/${cliente.id}/editar`} className="w-full sm:w-auto">
            <Button className="group w-full sm:w-auto h-11 rounded-xl bg-gradient-to-r from-primary to-accent shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <PencilIcon className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
              Editar
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="pedidos" className="space-y-6">
          <TabsList className="grid h-auto w-full grid-cols-2 gap-2 rounded-2xl border border-border/40 bg-card/50 p-2 backdrop-blur-sm sm:grid-cols-3 lg:grid-cols-6">
            <TabsTrigger
              value="pedidos"
              className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white data-[state=active]:shadow-lg"
            >
              Pedidos
            </TabsTrigger>
            <TabsTrigger
              value="pessoal"
              className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white data-[state=active]:shadow-lg"
            >
              Informações Pessoais
            </TabsTrigger>
            <TabsTrigger
              value="enderecos"
              className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white data-[state=active]:shadow-lg"
            >
              Endereço
            </TabsTrigger>
            <TabsTrigger
              value="profissional"
              className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white data-[state=active]:shadow-lg"
            >
              Dados profissionais
            </TabsTrigger>
            <TabsTrigger
              value="conjuge"
              className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white data-[state=active]:shadow-lg"
            >
              Cônjuge
            </TabsTrigger>
            <TabsTrigger
              value="referencias"
              className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white data-[state=active]:shadow-lg"
            >
              Referências
            </TabsTrigger>
          </TabsList>

          {/* Pessoal */}
          <TabsContent value="pessoal">
            <Card className="overflow-hidden rounded-2xl border-border/40 bg-card/50 backdrop-blur-sm shadow-xl">
              <CardHeader className="border-b border-border/40 bg-gradient-to-r from-primary/5 to-accent/5">
                <CardTitle className="font-heading text-lg">Informações:</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 p-6 sm:grid-cols-2">
                <p>
                  <strong>Nome:</strong> {cliente?.nome ?? "-"}
                </p>
                <p>
                  <strong>Email:</strong> {cliente?.email ?? "-"}
                </p>
                <p>
                  <strong>Telefone:</strong> {cliente?.telefone ? formatPhoneNumber(cliente.telefone) : "-"}
                </p>
                <p>
                  <strong>Filiação:</strong> {cliente?.filiacao ?? "-"}
                </p>
                <p>
                  <strong>Nacionalidade:</strong> {cliente?.nacionalidade ?? "-"}
                </p>
                <p>
                  <strong>Naturalidade:</strong> {cliente?.naturalidade ?? "-"}
                </p>
                <p>
                  <strong>Estado Civil:</strong> {cliente?.estadoCivil ?? "-"}
                </p>
                <p>
                  <strong>Data de Nascimento:</strong>{" "}
                  {cliente?.dataNascimento ? formatDateBR(cliente.dataNascimento) : "-"}
                </p>
                <p>
                  <strong>CPF:</strong> {cliente?.documento?.cpf ? formatCPF(cliente.documento.cpf) : "-"}
                </p>
                <p>
                  <strong>RG:</strong> {cliente?.documento?.rg ? formatRG(cliente.documento.rg) : "-"}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pedidos */}
          <TabsContent value="pedidos">
            <PedidosTab cliente={cliente} />
          </TabsContent>

          {/* Endereços */}
          <TabsContent value="enderecos">
            {cliente?.enderecos?.length ? (
              <div className="space-y-4">
                {cliente.enderecos.map((endereco, i) => (
                  <Card
                    key={i}
                    className="overflow-hidden rounded-2xl border-border/40 bg-card/50 backdrop-blur-sm shadow-xl"
                  >
                    <CardHeader className="border-b border-border/40 bg-gradient-to-r from-primary/5 to-accent/5">
                      <CardTitle className="font-heading text-lg">Endereço:</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 p-6 sm:grid-cols-2">
                      <p>
                        <strong>Logradouro:</strong> {endereco?.logradouro ?? "-"}
                      </p>
                      <p>
                        <strong>Bairro:</strong> {endereco?.bairro ?? "-"}
                      </p>
                      <p>
                        <strong>Número:</strong> {endereco?.numero ?? "-"}
                      </p>
                      <p>
                        <strong>Cidade:</strong> {endereco?.cidade ?? "-"}
                      </p>
                      <p>
                        <strong>Estado:</strong> {endereco?.estado?.toUpperCase() ?? "-"}
                      </p>
                      <p>
                        <strong>CEP:</strong> {endereco?.cep ? formatCEP(endereco.cep) : "-"}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="rounded-2xl border-border/40 bg-card/50 backdrop-blur-sm">
                <CardContent className="py-12 text-center text-muted-foreground">
                  Nenhum endereço cadastrado
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Profissional */}
          <TabsContent value="profissional">
            {cliente?.dadosProfissionais ? (
              <Card className="overflow-hidden rounded-2xl border-border/40 bg-card/50 backdrop-blur-sm shadow-xl">
                <CardHeader className="border-b border-border/40 bg-gradient-to-r from-primary/5 to-accent/5">
                  <CardTitle className="font-heading text-lg">Dados do Profissional</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  <div>
                    <h4 className="mb-2 text-sm font-semibold text-muted-foreground">Informações</h4>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <p>
                        <strong>Profissão:</strong> {cliente.dadosProfissionais?.profissao ?? "-"}
                      </p>
                      <p>
                        <strong>Salário:</strong>{" "}
                        {cliente.dadosProfissionais?.salario ? formatToBRL(cliente.dadosProfissionais.salario) : "-"}
                      </p>
                      <p>
                        <strong>Empresa:</strong> {cliente.dadosProfissionais?.empresa ?? "-"}
                      </p>
                    </div>
                  </div>
                  {cliente.dadosProfissionais?.enderecoEmpresa ? (
                    <div>
                      <h4 className="mb-2 text-sm font-semibold text-muted-foreground">Endereço da Empresa</h4>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <p>
                          <strong>Logradouro:</strong> {cliente.dadosProfissionais.enderecoEmpresa?.logradouro ?? "-"}
                        </p>
                        <p>
                          <strong>Bairro:</strong> {cliente.dadosProfissionais.enderecoEmpresa?.bairro ?? "-"}
                        </p>
                        <p>
                          <strong>Cidade:</strong> {cliente.dadosProfissionais.enderecoEmpresa?.cidade ?? "-"}
                        </p>
                        <p>
                          <strong>Estado:</strong>{" "}
                          {cliente.dadosProfissionais.enderecoEmpresa?.estado?.toUpperCase() ?? "-"}
                        </p>
                        <p>
                          <strong>CEP:</strong>{" "}
                          {cliente.dadosProfissionais.enderecoEmpresa?.cep
                            ? formatCEP(cliente.dadosProfissionais.enderecoEmpresa.cep)
                            : "-"}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Nenhum endereço da empresa cadastrado</p>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="rounded-2xl border-border/40 bg-card/50 backdrop-blur-sm">
                <CardContent className="py-12 text-center text-muted-foreground">
                  Nenhum dado profissional cadastrado
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Cônjuge */}
          <TabsContent value="conjuge">
            {cliente?.conjuge ? (
              <Card className="overflow-hidden rounded-2xl border-border/40 bg-card/50 backdrop-blur-sm shadow-xl">
                <CardHeader className="border-b border-border/40 bg-gradient-to-r from-primary/5 to-accent/5">
                  <CardTitle className="font-heading text-lg">Informações do Cônjuge</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 p-6 sm:grid-cols-2">
                  <p>
                    <strong>Nome:</strong> {cliente.conjuge?.nome ?? "-"}
                  </p>
                  <p>
                    <strong>Data de Nascimento:</strong>{" "}
                    {cliente.conjuge?.dataNascimento ? formatDateBR(cliente.conjuge.dataNascimento) : "-"}
                  </p>
                  <p>
                    <strong>Naturalidade:</strong> {cliente.conjuge?.naturalidade ?? "-"}
                  </p>
                  <p>
                    <strong>Local de Trabalho:</strong> {cliente.conjuge?.localDeTrabalho ?? "-"}
                  </p>
                  <p>
                    <strong>CPF:</strong>{" "}
                    {cliente.conjuge?.documento?.rg ? formatCPF(cliente.conjuge.documento.rg) : "-"}
                  </p>
                  <p>
                    <strong>RG:</strong>{" "}
                    {cliente.conjuge?.documento?.cpf ? formatRG(cliente.conjuge.documento.cpf) : "-"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card className="rounded-2xl border-border/40 bg-card/50 backdrop-blur-sm">
                <CardContent className="py-12 text-center text-muted-foreground">Nenhum cônjuge cadastrado</CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Referências */}
          <TabsContent value="referencias">
            {cliente?.referencias?.length ? (
              <div className="space-y-4">
                {cliente.referencias.map((referencia, i) => (
                  <Card
                    key={i}
                    className="overflow-hidden rounded-2xl border-border/40 bg-card/50 backdrop-blur-sm shadow-xl"
                  >
                    <CardHeader className="border-b border-border/40 bg-gradient-to-r from-primary/5 to-accent/5">
                      <CardTitle className="font-heading text-lg">Referência {i + 1}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 p-6">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <p>
                          <strong>Nome:</strong> {referencia?.nome ?? "-"}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground">Nenhum endereço cadastrado</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="rounded-2xl border-border/40 bg-card/50 backdrop-blur-sm">
                <CardContent className="py-12 text-center text-muted-foreground">
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
