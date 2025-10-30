"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Stepper } from "@/components/ui/stepper"
import { PlusIcon, ChevronLeftIcon, ChevronRightIcon, AlertCircle } from "@/components/icons"
import { PatternFormat } from "react-number-format"
import { NumericFormat } from "react-number-format"

import type {
  Cliente,
  Endereco,
  DadosProfissionais,
  Conjuge,
  Referencia,
  Pagamento,
  ProdutoSelecionado,
} from "@/lib/data/clientes"
import { EnderecoForm } from "./endereco-form"
import { ProdutoSeletor } from "./produto-seletor"
import { PagamentoForm } from "./pagamento-form"
import { validateClienteForm, validateClienteFormFinal } from "@/lib/validations/cliente-validation"
import { ClienteResumoFinal } from "./cliente-resumo-final"

interface ClienteFormStepperProps {
  cliente?: Cliente
  onSubmit: (data: Omit<Cliente, "id" | "dataCadastro">) => void
  isSubmitting?: boolean
}

const steps = [
  { id: "pessoal", title: "Pessoal", description: "Dados pessoais" },
  { id: "enderecos", title: "Endereços", description: "Endereços" },
  { id: "profissional", title: "Profissional", description: "Dados profissionais" },
  { id: "conjuge", title: "Cônjuge", description: "Dados do cônjuge" },
  { id: "produtos", title: "Produtos", description: "Selecionar produtos" },
  { id: "pagamento", title: "Pagamento", description: "Informações de pagamento" },
  { id: "resumo", title: "Resumo", description: "Revisar dados" },
]

export function ClienteFormStepper({ cliente, onSubmit, isSubmitting = false }: ClienteFormStepperProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [validationErrors, setValidationErrors] = useState<any[]>([])

  const [formData, setFormData] = useState({
    nome: cliente?.nome || "",
    email: cliente?.email || "",
    telefone: cliente?.telefone || "",
    filiacao: cliente?.filiacao || "",
    nacionalidade: cliente?.nacionalidade || "Brasileiro",
    naturalidade: cliente?.naturalidade || "",
    estadoCivil: cliente?.estadoCivil || "Solteiro",
    dataNascimento: cliente?.dataNascimento || "",
    cpf: cliente?.documento?.cpf || "",
    rg: cliente?.documento?.rg || "",
  })

  const [enderecos, setEnderecos] = useState<Endereco[]>(
    cliente?.enderecos || [
      {
        logradouro: "",
        numero: "",
        bairro: "",
        cep: "",
        localizacao: "",
        cidade: "",
        estado: "SP",
      },
    ],
  )

  const [dadosProfissionais, setDadosProfissionais] = useState<DadosProfissionais>({
    empresa: "",
    telefone: "",
    profissao: "",
    salario: 0,
    enderecoEmpresa: {
      logradouro: "",
      numero: "",
      bairro: "",
      cep: "",
      localizacao: "",
      cidade: "",
      estado: "SP",
    },
  })

  const [conjuge, setConjuge] = useState<Conjuge | undefined>(cliente?.conjuge)
  const [referencias, setReferencias] = useState<Referencia[]>(cliente?.referencias || [])
  const [produtosSelecionados, setProdutosSelecionados] = useState<ProdutoSelecionado[]>(cliente?.estoque || [])
  const [pagamento, setPagamento] = useState<Pagamento | undefined>(cliente?.pagamento)

  useEffect(() => {
    if (produtosSelecionados.length === 0) return

    const total = produtosSelecionados.reduce((acc, produto) => acc + produto.preco * produto.quantidadeSelecionada, 0)

    setPagamento((prev) => {
      if (prev && prev.valorTotal === total) return prev

      return {
        valorTotal: total,
        sinal: 0,
        dataInicio: new Date().toISOString().substring(0, 10),
        numeroParcelas: 1,
        parcelas: [],
      }
    })
  }, [produtosSelecionados])

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" })
      document.documentElement.scrollTop = 0
    }, 0)
  }, [currentStep])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const validation = validateClienteFormFinal(
      formData,
      enderecos,
      dadosProfissionais,
      conjuge,
      produtosSelecionados,
      pagamento,
    )

    if (!validation.isValid) {
      setValidationErrors(validation.errors)
      return
    }

    setValidationErrors([])
    onSubmit({
      ...formData,
      enderecos,
      dadosProfissionais,
      conjuge,
      referencias,
      estoque: produtosSelecionados,
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
        numero: "",
        bairro: "",
        cep: "",
        localizacao: "",
        cidade: "",
        estado: "SP",
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

  const nextStep = () => {
    const validation = validateClienteForm(
      formData,
      enderecos,
      dadosProfissionais,
      conjuge,
      produtosSelecionados,
      pagamento,
      currentStep,
    )

    if (!validation.isValid) {
      setValidationErrors(validation.errors)
      return
    }

    setValidationErrors([])
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    setValidationErrors([])
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const isLastStep = currentStep === steps.length
  const isSixthStep = currentStep === 6

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Stepper steps={steps} currentStep={currentStep} />

      {validationErrors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              <p className="font-semibold">Por favor, corrija os seguintes erros:</p>
              <ul className="list-disc list-inside text-sm">
                {validationErrors.map((error, idx) => (
                  <li key={idx}>{error.message}</li>
                ))}
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 ">
                <Label htmlFor="nome">Nome Completo</Label>
                <Input id="nome" name="nome" value={formData.nome} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="john@outlook.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <PatternFormat
                  format="(##) #####-####"
                  value={formData.telefone}
                  onValueChange={(values) => setFormData((prev) => ({ ...prev, telefone: values.value }))}
                  customInput={Input}
                  placeholder="(11) 99999-9999"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="filiacao">Filiação</Label>
                <Input
                  id="filiacao"
                  name="filiacao"
                  value={formData.filiacao}
                  onChange={handleChange}
                  placeholder="Nome do pai ou mãe"
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
                <PatternFormat
                  format="###.###.###-##"
                  value={formData.cpf}
                  onValueChange={(values) => setFormData((prev) => ({ ...prev, cpf: values.value }))}
                  customInput={Input}
                  placeholder="000.000.000-00"
                  required
                />
              </div>
              {/* RG */}
              <div className="space-y-2">
                <Label htmlFor="rg">RG</Label>
                <PatternFormat
                  format="##.###.###-#"
                  value={formData.rg}
                  onValueChange={(values) => setFormData((prev) => ({ ...prev, rg: values.value }))}
                  customInput={Input}
                  placeholder="00.000.000-0"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 2 && (
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
      )}

      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Dados Profissionais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Profissão</Label>
                <Input
                  value={dadosProfissionais?.profissao || ""}
                  onChange={(e) =>
                    setDadosProfissionais((prev) => ({
                      ...prev!,
                      profissao: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Empresa Atual (Opcional)</Label>
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
                <Label>Telefone Comercial</Label>
                <PatternFormat
                  format="(##) #####-####"
                  value={dadosProfissionais?.telefone || ""}
                  onValueChange={(values) =>
                    setDadosProfissionais((prev) => ({
                      ...prev!,
                      telefone: values.value,
                    }))
                  }
                  customInput={Input}
                  placeholder="(11) 99999-9999"
                />
              </div>
              <div className="space-y-2">
                <Label>Salário (Opcional)</Label>
                {dadosProfissionais && (
                  <NumericFormat
                    value={dadosProfissionais?.salario ?? 0}
                    onValueChange={(values) =>
                      setDadosProfissionais((prev) => ({
                        ...prev!,
                        salario: values.floatValue || 0,
                      }))
                    }
                    thousandSeparator="."
                    decimalSeparator=","
                    prefix="R$ "
                    customInput={Input}
                    placeholder="R$ 0,00"
                  />
                )}
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
      )}

      {currentStep === 4 && (
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
                    <PatternFormat
                      format="###.###.###-##"
                      value={conjuge.cpf}
                      onValueChange={(values) =>
                        setConjuge((prev) => ({
                          ...prev!,
                          cpf: values.value,
                        }))
                      }
                      customInput={Input}
                      placeholder="000.000.000-00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>RG</Label>
                    <PatternFormat
                      format="##.###.###-#"
                      value={conjuge.rg}
                      onValueChange={(values) =>
                        setConjuge((prev) => ({
                          ...prev!,
                          rg: values.value,
                        }))
                      }
                      customInput={Input}
                      placeholder="00.000.000-0"
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
      )}

      {currentStep === 5 && (
        <ProdutoSeletor produtosSelecionados={produtosSelecionados} onChange={setProdutosSelecionados} />
      )}

      {currentStep === 6 && (
        <PagamentoForm
          pagamento={pagamento ?? { valorTotal: 0, sinal: 0, dataInicio: "", numeroParcelas: 1, parcelas: [] }}
          produtosSelecionados={produtosSelecionados}
          onChange={setPagamento}
        />
      )}

      {currentStep === 7 && (
        <ClienteResumoFinal
          formData={formData}
          enderecos={enderecos}
          dadosProfissionais={dadosProfissionais}
          conjuge={conjuge}
          produtosSelecionados={produtosSelecionados}
          pagamento={pagamento}
        />
      )}

      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1 || isSubmitting}
            className="w-full sm:w-auto bg-transparent"
          >
            <ChevronLeftIcon className="mr-2 h-4 w-4" />
            Anterior
          </Button>
          {!isLastStep && (
            <Button
              type="button"
              onClick={nextStep}
              disabled={isSubmitting || (currentStep === 5 && produtosSelecionados.length === 0)}
              className="w-full sm:w-auto"
            >
              Próximo
              <ChevronRightIcon className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            Cancelar
          </Button>
          {isLastStep && (
            <Button type="submit" disabled={isSubmitting || validationErrors.length > 0} className="w-full sm:w-auto">
              {isSubmitting ? "Salvando..." : "Salvar Cliente"}
            </Button>
          )}
        </div>
      </div>
    </form>
  )
}
