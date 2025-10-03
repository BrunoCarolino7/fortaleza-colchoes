"use client"

import { redirect } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PencilIcon, ArrowLeftIcon } from "@/components/icons"
import { Skeleton } from "@/components/ui/skeleton"
import { useFetch } from "@/hooks/use-request"

export default function ClienteDetalhesPage({ params }: { params: { id: string } }) {
  if (params.id === "novo") {
    redirect("/clientes/novo")
  }

  const { data: clientes, loading, error } = useFetch<Cliente[]>(
    "https://localhost:7195/api/cliente"
  )
  console.log("Clientes", clientes)
  console.log("loading", loading, "error", error, "clientes", clientes)


  if (loading) {
    return (
      <div className="flex flex-col">
        <Header title="Carregando Cliente..." />
        <div className="flex-1 overflow-auto p-4 sm:p-6">
          <Skeleton className="h-10 w-40 mb-4" />
          <Skeleton className="h-4 w-2/3 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-2" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col">
        <Header title="Erro" />
        <div className="p-4 sm:p-6">
          <p>Erro ao carregar cliente.</p>
        </div>
      </div>
    )
  }

  if (!clientes?.length) {
    return (
      <div className="flex flex-col">
        <Header title="Cliente não encontrado" />
        <div className="p-4 sm:p-6">
          <p>Nenhum cliente encontrado.</p>
        </div>
      </div>
    )
  }

  // transforma "1,2,3" em [1, 2, 3]
  const ids = params.id.split(",").map((id) => Number(id.trim()))
  const clientesSelecionados = clientes.filter((c) => ids.includes(c.id))

  if (!clientesSelecionados.length) {
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
      <div className="flex-1 overflow-auto p-4 sm:p-6 space-y-8">
        {clientesSelecionados.map((cliente) => (
          <div key={cliente.id} className="space-y-6">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
              <Link href="/clientes">
                <Button variant="ghost" size="icon">
                  <ArrowLeftIcon className="h-4 w-4" />
                </Button>
              </Link>
              <Link href={`/clientes/${cliente.id}/editar`} className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto">
                  <PencilIcon className="mr-2 h-4 w-4" />
                  Editar
                </Button>
              </Link>
            </div>

            <Tabs defaultValue="pessoal" className="space-y-4">
              <TabsList className="grid h-auto w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
                <TabsTrigger value="pessoal">Pessoal</TabsTrigger>
                <TabsTrigger value="enderecos">Endereços</TabsTrigger>
                <TabsTrigger value="profissional">Profissional</TabsTrigger>
                <TabsTrigger value="conjuge">Cônjuge</TabsTrigger>
                <TabsTrigger value="referencias">Referências</TabsTrigger>
              </TabsList>

              {/* Pessoal */}
              <TabsContent value="pessoal">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Informações Pessoais</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-4 sm:grid-cols-2">
                    <p><strong>Nome:</strong> {cliente?.nome ?? "-"}</p>
                    <p><strong>Filiação:</strong> {cliente?.filiacao ?? "-"}</p>
                    <p><strong>Nacionalidade:</strong> {cliente?.nacionalidade ?? "-"}</p>
                    <p><strong>Naturalidade:</strong> {cliente?.naturalidade ?? "-"}</p>
                    <p><strong>Estado Civil:</strong> {cliente?.estadoCivil ?? "-"}</p>
                    <p><strong>Data de Nascimento:</strong> {cliente?.dataNascimento ?? "-"}</p>
                    <p><strong>CPF:</strong> {cliente?.documento?.cpf ?? "-"}</p>
                    <p><strong>RG:</strong> {cliente?.documento?.rg ?? "-"}</p>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Endereços */}
              <TabsContent value="enderecos">
                {cliente?.enderecos?.length ? (
                  <div className="space-y-4">
                    {cliente.enderecos.map((endereco, i) => (
                      <Card key={i}>
                        <CardHeader>
                          <CardTitle className="text-base">Endereço {i + 1}</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 sm:grid-cols-2">
                          <p><strong>Logradouro:</strong> {endereco?.logradouro ?? "-"}</p>
                          <p><strong>Bairro:</strong> {endereco?.bairro ?? "-"}</p>
                          <p><strong>Localização:</strong> {endereco?.numero ?? "-"}</p>
                          <p><strong>Cidade:</strong> {endereco?.cidade ?? "-"}</p>
                          <p><strong>Estado:</strong> {endereco?.estado ?? "-"}</p>
                          <p><strong>CEP:</strong> {endereco?.cep ?? "-"}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="py-8 text-center text-muted-foreground">
                      Nenhum endereço cadastrado
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Profissional */}
              <TabsContent value="profissional">
                {cliente?.dadosProfissionais ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Dados Profissionais</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h4 className="text-sm font-semibold mb-2 text-muted-foreground">Informações</h4>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <p><strong>Profissão:</strong> {cliente.dadosProfissionais?.profissao ?? "-"}</p>
                          <p><strong>Salário:</strong> {cliente.dadosProfissionais?.salario ?? "-"}</p>
                          <p><strong>Empresa:</strong> {cliente.dadosProfissionais?.empresa ?? "-"}</p>
                        </div>
                      </div>
                      {cliente.dadosProfissionais?.enderecoEmpresa ? (
                        <div>
                          <h4 className="text-sm font-semibold mb-2 text-muted-foreground">Endereço da Empresa</h4>
                          <div className="grid gap-4 sm:grid-cols-2">
                            <p><strong>Logradouro:</strong> {cliente.dadosProfissionais.enderecoEmpresa?.logradouro ?? "-"}</p>
                            <p><strong>Bairro:</strong> {cliente.dadosProfissionais.enderecoEmpresa?.bairro ?? "-"}</p>
                            <p><strong>Cidade:</strong> {cliente.dadosProfissionais.enderecoEmpresa?.cidade ?? "-"}</p>
                            <p><strong>Estado:</strong> {cliente.dadosProfissionais.enderecoEmpresa?.estado ?? "-"}</p>
                            <p><strong>CEP:</strong> {cliente.dadosProfissionais.enderecoEmpresa?.cep ?? "-"}</p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">Nenhum endereço da empresa cadastrado</p>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="py-8 text-center text-muted-foreground">
                      Nenhum dado profissional cadastrado
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Cônjuge */}
              <TabsContent value="conjuge">
                {cliente?.conjuge ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Informações do Cônjuge</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                      <p><strong>Nome:</strong> {cliente.conjuge?.nome ?? "-"}</p>
                      <p><strong>Data de Nascimento:</strong> {cliente.conjuge?.dataNascimento ?? "-"}</p>
                      <p><strong>Naturalidade:</strong> {cliente.conjuge?.naturalidade ?? "-"}</p>
                      <p><strong>Local de Trabalho:</strong> {cliente.conjuge?.localDeTrabalho ?? "-"}</p>
                      <p><strong>CPF:</strong> {cliente.conjuge?.documento?.cpf ?? "-"}</p>
                      <p><strong>RG:</strong> {cliente.conjuge?.documento?.rg ?? "-"}</p>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="py-8 text-center text-muted-foreground">
                      Nenhum cônjuge cadastrado
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Referências */}
              <TabsContent value="referencias">
                {cliente?.referencias?.length ? (
                  <div className="space-y-4">
                    {cliente.referencias.map((referencia, i) => (
                      <Card key={i}>
                        <CardHeader>
                          <CardTitle className="text-base">Referência {i + 1}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid gap-4 sm:grid-cols-2">
                            <p><strong>Nome:</strong> {referencia?.nome ?? "-"}</p>
                          </div>
                          {referencia?.nome ? (
                            <div>
                              <h4 className="text-sm font-semibold mb-2 text-muted-foreground">Endereço</h4>
                              <div className="grid gap-4 sm:grid-cols-2">
                                <p><strong>Logradouro:</strong> </p>
                                <p><strong>Bairro:</strong></p>
                                <p><strong>Jardim:</strong> </p>
                                <p><strong>Localização:</strong> </p>
                                <p><strong>Cidade:</strong> </p>
                                <p><strong>Estado:</strong> </p>
                                <p><strong>CEP:</strong> </p>
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">Nenhum endereço cadastrado</p>
                          )}
                        </CardContent>
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
        ))}
      </div>
    </div>
  )
}
