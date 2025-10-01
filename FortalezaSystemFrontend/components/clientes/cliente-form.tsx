"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusIcon, Trash2Icon } from "@/components/icons"
import type {
  Cliente,
  Endereco,
  DadosProfissionais,
  Conjuge,
  Referencia,
  Pagamento,
  Parcela,
} from "@/lib/data/clientes"
import { EnderecoForm } from "./endereco-form"

interface ClienteFormProps {
  cliente?: Cliente
  onSubmit: (data: Omit<Cliente, "id" | "dataCadastro">) => void
  isSubmitting?: boolean // Adicionando prop para controlar estado de submissão
}

export function ClienteForm({ cliente, onSubmit, isSubmitting = false }: ClienteFormProps) {
  const router = useRouter()

  const [formData, setFormData] = useState({
    nome: cliente?.nome || "",
    filiacao: cliente?.filiacao || "",
    nacionalidade: cliente?.nacionalidade || "Brasileiro",
    naturalidade: cliente?.naturalidade || "",
    estadoCivil: cliente?.estadoCivil || "Solteiro",
    dataNascimento: cliente?.dataNascimento || "",
    cpf: cliente?.cpf || "",
    rg: cliente?.rg || "",
    assinatura: cliente?.assinatura || "",
  })

  const [enderecos, setEnderecos] = useState<Endereco[]>(
    cliente?.enderecos || [
      {
        logradouro: "",
        bairro: "",
        jardim: "",
        cep: "",
        localizacao: "",
        cidade: "",
        estado: "",
      },
    ],
  )

  const [dadosProfissionais, setDadosProfissionais] = useState<DadosProfissionais | undefined>(
    cliente?.dadosProfissionais || {
      empresa: "",
      empregoAnterior: "",
      telefone: "",
      salario: 0,
      enderecoEmpresa: {
        logradouro: "",
        bairro: "",
        jardim: "",
        cep: "",
        localizacao: "",
        cidade: "",
        estado: "",
      },
    },
  )

  const [conjuge, setConjuge] = useState<Conjuge | undefined>(cliente?.conjuge)

  const [referencias, setReferencias] = useState<Referencia[]>(cliente?.referencias || [])

  const [pagamento, setPagamento] = useState<Pagamento | undefined>(cliente?.pagamento)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      enderecos,
      dadosProfissionais,
      conjuge,
      referencias,
      pagamento,
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const addEndereco = () => {
    setEnderecos([
      ...enderecos,
      {
        logradouro: "",
        bairro: "",
        jardim: "",
        cep: "",
        localizacao: "",
        cidade: "",
        estado: "",
      },
    ])
  }

  const removeEndereco = (index: number) => {
    setEnderecos(enderecos.filter((_, i) => i !== index))
  }

  const updateEndereco = (index: number, endereco: Endereco) => {
    const newEnderecos = [...enderecos]
    newEnderecos[index] = endereco
    setEnderecos(newEnderecos)
  }

  const addReferencia = () => {
    setReferencias([
      ...referencias,
      {
        nome: "",
        endereco: {
          logradouro: "",
          bairro: "",
          jardim: "",
          cep: "",
          localizacao: "",
          cidade: "",
          estado: "",
        },
      },
    ])
  }

  const removeReferencia = (index: number) => {
    setReferencias(referencias.filter((_, i) => i !== index))
  }

  const updateReferencia = (index: number, referencia: Referencia) => {
    const newReferencias = [...referencias]
    newReferencias[index] = referencia
    setReferencias(newReferencias)
  }

  const gerarParcelas = () => {
    if (!pagamento) return

    const { valorTotal, sinal, numeroParcelas, dataInicio } = pagamento
    const valorRestante = valorTotal - sinal
    const valorParcela = valorRestante / numeroParcelas

    const parcelas: Parcela[] = []
    const dataBase = new Date(dataInicio)

    for (let i = 1; i <= numeroParcelas; i++) {
      const dataVencimento = new Date(dataBase)
      dataVencimento.setMonth(dataVencimento.getMonth() + i)

      parcelas.push({
        numero: i,
        valor: Number(valorParcela.toFixed(2)),
        vencimento: dataVencimento.toISOString().split("T")[0],
        statusPagamento: 0,
      })
    }

    setPagamento((prev) => ({
      ...prev!,
      parcelas,
    }))
  }

  const updateParcela = (index: number, parcela: Parcela) => {
    if (!pagamento) return
    const newParcelas = [...pagamento.parcelas]
    newParcelas[index] = parcela
    setPagamento((prev) => ({
      ...prev!,
      parcelas: newParcelas,
    }))
  }

  const removeParcela = (index: number) => {
    if (!pagamento) return
    setPagamento((prev) => ({
      ...prev!,
      parcelas: prev!.parcelas.filter((_, i) => i !== index),
    }))
  }

  return (
    <form onSubmit={handleSubmit}>
      <Tabs defaultValue="pessoal" className="space-y-4">
        <div className="overflow-x-auto">
          <TabsList className="inline-flex h-auto w-full min-w-max sm:grid sm:grid-cols-3 lg:grid-cols-6">
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
            <TabsTrigger value="pagamento" className="text-xs sm:text-sm">
              Pagamento
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="pessoal">
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="nome">Nome Completo</Label>
                  <Input id="nome" name="nome" value={formData.nome} onChange={handleChange} required />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="filiacao">Filiação</Label>
                  <Input
                    id="filiacao"
                    name="filiacao"
                    value={formData.filiacao}
                    onChange={handleChange}
                    placeholder="Nome do pai e da mãe"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dataNascimento">Data de Nascimento</Label>
                  <Input
                    id="dataNascimento"
                    name="dataNascimento"
                    type="date"
                    value={formData.dataNascimento}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estadoCivil">Estado Civil</Label>
                  <Select
                    value={formData.estadoCivil}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, estadoCivil: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Solteiro">Solteiro(a)</SelectItem>
                      <SelectItem value="Casado">Casado(a)</SelectItem>
                      <SelectItem value="Divorciado">Divorciado(a)</SelectItem>
                      <SelectItem value="Viúvo">Viúvo(a)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nacionalidade">Nacionalidade</Label>
                  <Input
                    id="nacionalidade"
                    name="nacionalidade"
                    value={formData.nacionalidade}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="naturalidade">Naturalidade</Label>
                  <Input
                    id="naturalidade"
                    name="naturalidade"
                    value={formData.naturalidade}
                    onChange={handleChange}
                    placeholder="Cidade - UF"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF</Label>
                  <Input id="cpf" name="cpf" value={formData.cpf} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rg">RG</Label>
                  <Input id="rg" name="rg" value={formData.rg} onChange={handleChange} required />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="assinatura">Assinatura</Label>
                  <Input
                    id="assinatura"
                    name="assinatura"
                    value={formData.assinatura}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="enderecos">
          <div className="space-y-4">
            {enderecos.map((endereco, index) => (
              <EnderecoForm
                key={index}
                endereco={endereco}
                onChange={(e) => updateEndereco(index, e)}
                onRemove={enderecos.length > 1 ? () => removeEndereco(index) : undefined}
                title={`Endereço ${index + 1}`}
                showRemove={enderecos.length > 1}
              />
            ))}
            <Button type="button" variant="outline" onClick={addEndereco} className="w-full sm:w-auto bg-transparent">
              <PlusIcon className="mr-2 h-4 w-4" />
              Adicionar Endereço
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="profissional">
          <Card>
            <CardHeader>
              <CardTitle>Dados Profissionais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Empresa Atual</Label>
                  <Input
                    value={dadosProfissionais?.empresa || ""}
                    onChange={(e) =>
                      setDadosProfissionais((prev) => ({
                        ...prev!,
                        empresa: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Emprego Anterior</Label>
                  <Input
                    value={dadosProfissionais?.empregoAnterior || ""}
                    onChange={(e) =>
                      setDadosProfissionais((prev) => ({
                        ...prev!,
                        empregoAnterior: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Telefone Comercial</Label>
                  <Input
                    value={dadosProfissionais?.telefone || ""}
                    onChange={(e) =>
                      setDadosProfissionais((prev) => ({
                        ...prev!,
                        telefone: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Salário</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={dadosProfissionais?.salario || 0}
                    onChange={(e) =>
                      setDadosProfissionais((prev) => ({
                        ...prev!,
                        salario: Number.parseFloat(e.target.value),
                      }))
                    }
                  />
                </div>
              </div>
              {dadosProfissionais && (
                <div className="pt-4">
                  <EnderecoForm
                    endereco={dadosProfissionais.enderecoEmpresa}
                    onChange={(e) =>
                      setDadosProfissionais((prev) => ({
                        ...prev!,
                        enderecoEmpresa: e,
                      }))
                    }
                    title="Endereço da Empresa"
                    showRemove={false}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conjuge">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Cônjuge</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!conjuge ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setConjuge({
                      nome: "",
                      dataNascimento: "",
                      naturalidade: "",
                      localDeTrabalho: "",
                      cpf: "",
                      rg: "",
                    })
                  }
                  className="w-full sm:w-auto"
                >
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Adicionar Cônjuge
                </Button>
              ) : (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2 sm:col-span-2">
                      <Label>Nome Completo</Label>
                      <Input
                        value={conjuge.nome}
                        onChange={(e) =>
                          setConjuge((prev) => ({
                            ...prev!,
                            nome: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Data de Nascimento</Label>
                      <Input
                        type="date"
                        value={conjuge.dataNascimento}
                        onChange={(e) =>
                          setConjuge((prev) => ({
                            ...prev!,
                            dataNascimento: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Naturalidade</Label>
                      <Input
                        value={conjuge.naturalidade}
                        onChange={(e) =>
                          setConjuge((prev) => ({
                            ...prev!,
                            naturalidade: e.target.value,
                          }))
                        }
                        placeholder="Cidade - UF"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Local de Trabalho</Label>
                      <Input
                        value={conjuge.localDeTrabalho}
                        onChange={(e) =>
                          setConjuge((prev) => ({
                            ...prev!,
                            localDeTrabalho: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>CPF</Label>
                      <Input
                        value={conjuge.cpf}
                        onChange={(e) =>
                          setConjuge((prev) => ({
                            ...prev!,
                            cpf: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>RG</Label>
                      <Input
                        value={conjuge.rg}
                        onChange={(e) =>
                          setConjuge((prev) => ({
                            ...prev!,
                            rg: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setConjuge(undefined)}
                    className="w-full sm:w-auto"
                  >
                    Remover Cônjuge
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="referencias">
          <div className="space-y-4">
            {referencias.map((referencia, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base">Referência {index + 1}</CardTitle>
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeReferencia(index)}>
                    <Trash2Icon className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Nome</Label>
                    <Input
                      value={referencia.nome}
                      onChange={(e) =>
                        updateReferencia(index, {
                          ...referencia,
                          nome: e.target.value,
                        })
                      }
                    />
                  </div>
                  <EnderecoForm
                    endereco={referencia.endereco}
                    onChange={(e) =>
                      updateReferencia(index, {
                        ...referencia,
                        endereco: e,
                      })
                    }
                    title="Endereço da Referência"
                    showRemove={false}
                  />
                </CardContent>
              </Card>
            ))}
            <Button type="button" variant="outline" onClick={addReferencia} className="w-full sm:w-auto bg-transparent">
              <PlusIcon className="mr-2 h-4 w-4" />
              Adicionar Referência
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="pagamento">
          <Card>
            <CardHeader>
              <CardTitle>Informações de Pagamento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!pagamento ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setPagamento({
                      valorTotal: 0,
                      sinal: 0,
                      dataInicio: "",
                      numeroParcelas: 1,
                      parcelas: [],
                    })
                  }
                  className="w-full sm:w-auto"
                >
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Adicionar Informações de Pagamento
                </Button>
              ) : (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Valor Total</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={pagamento.valorTotal}
                        onChange={(e) =>
                          setPagamento((prev) => ({
                            ...prev!,
                            valorTotal: Number.parseFloat(e.target.value),
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Sinal (Entrada)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={pagamento.sinal}
                        onChange={(e) =>
                          setPagamento((prev) => ({
                            ...prev!,
                            sinal: Number.parseFloat(e.target.value),
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Data de Início</Label>
                      <Input
                        type="date"
                        value={pagamento.dataInicio}
                        onChange={(e) =>
                          setPagamento((prev) => ({
                            ...prev!,
                            dataInicio: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Número de Parcelas</Label>
                      <Input
                        type="number"
                        min="1"
                        value={pagamento.numeroParcelas}
                        onChange={(e) =>
                          setPagamento((prev) => ({
                            ...prev!,
                            numeroParcelas: Number.parseInt(e.target.value),
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={gerarParcelas}
                      className="w-full sm:w-auto bg-transparent"
                    >
                      Gerar Parcelas Automaticamente
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setPagamento(undefined)}
                      className="w-full sm:w-auto"
                    >
                      Remover Pagamento
                    </Button>
                  </div>

                  {pagamento.parcelas.length > 0 && (
                    <div className="space-y-4 pt-4">
                      <h3 className="font-semibold text-base sm:text-lg">Parcelas</h3>
                      <div className="space-y-3">
                        {pagamento.parcelas.map((parcela, index) => (
                          <Card key={index}>
                            <CardContent className="pt-6">
                              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 items-end">
                                <div className="space-y-2">
                                  <Label>Número</Label>
                                  <Input
                                    type="number"
                                    value={parcela.numero}
                                    onChange={(e) =>
                                      updateParcela(index, {
                                        ...parcela,
                                        numero: Number.parseInt(e.target.value),
                                      })
                                    }
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Valor</Label>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    value={parcela.valor}
                                    onChange={(e) =>
                                      updateParcela(index, {
                                        ...parcela,
                                        valor: Number.parseFloat(e.target.value),
                                      })
                                    }
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Vencimento</Label>
                                  <Input
                                    type="date"
                                    value={parcela.vencimento}
                                    onChange={(e) =>
                                      updateParcela(index, {
                                        ...parcela,
                                        vencimento: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Status</Label>
                                  <Select
                                    value={parcela.statusPagamento.toString()}
                                    onValueChange={(value) =>
                                      updateParcela(index, {
                                        ...parcela,
                                        statusPagamento: Number.parseInt(value),
                                      })
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="0">Pendente</SelectItem>
                                      <SelectItem value="1">Pago</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <Button type="button" variant="ghost" size="icon" onClick={() => removeParcela(index)}>
                                  <Trash2Icon className="h-4 w-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
          {isSubmitting ? "Salvando..." : "Salvar Cliente"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          Cancelar
        </Button>
      </div>
    </form>
  )
}
