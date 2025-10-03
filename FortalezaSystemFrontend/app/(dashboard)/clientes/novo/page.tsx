"use client"

import axios from "axios"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { ClienteFormStepper } from "@/components/clientes/cliente-form-stepper"
import { useState } from "react"

export default function NovoClientePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const handleSubmit = async (formData: any) => {
    setIsSubmitting(true)
    try {
      // helpers
      const toDateOnly = (value: any) => {
        if (!value) return null
        if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value
        const d = new Date(value)
        return isNaN(d.getTime()) ? null : d.toISOString().split("T")[0]
      }

      const toDateTime = (value: any) => {
        if (!value) return null
        const d = new Date(value)
        return isNaN(d.getTime()) ? null : d.toISOString()
      }

      const payload = {
        nome: formData.nome,
        filiacao: formData.filiacao,
        nacionalidade: formData.nacionalidade,
        naturalidade: formData.naturalidade,
        estadoCivil: formData.estadoCivil,
        dataNascimento: toDateOnly(formData.dataNascimento),
        cpf: formData.cpf,
        rg: formData.rg,
        assinatura: formData.assinatura ?? "",

        enderecos: formData.enderecos?.map((e: any) => ({
          logradouro: e.logradouro,
          bairro: e.bairro,
          jardim: e.jardim,
          cep: e.cep,
          localizacao: e.localizacao,
          cidade: e.cidade,
          estado: e.estado
        })) ?? [],

        dadosProfissionais: formData.dadosProfissionais
          ? {
            empresa: formData.dadosProfissionais.empresa,
            empregoAnterior: formData.dadosProfissionais.empregoAnterior,
            telefone: formData.dadosProfissionais.telefone,
            salario: formData.dadosProfissionais.salario,
            enderecoEmpresa: {
              logradouro: formData.dadosProfissionais.enderecoEmpresa?.logradouro,
              bairro: formData.dadosProfissionais.enderecoEmpresa?.bairro,
              jardim: formData.dadosProfissionais.enderecoEmpresa?.jardim,
              cep: formData.dadosProfissionais.enderecoEmpresa?.cep,
              localizacao: formData.dadosProfissionais.enderecoEmpresa?.localizacao,
              cidade: formData.dadosProfissionais.enderecoEmpresa?.cidade,
              estado: formData.dadosProfissionais.enderecoEmpresa?.estado
            }
          }
          : null,

        conjuge: formData.conjuge
          ? {
            nome: formData.conjuge.nome,
            dataNascimento: toDateOnly(formData.conjuge.dataNascimento),
            naturalidade: formData.conjuge.naturalidade,
            localDeTrabalho: formData.conjuge.localDeTrabalho,
            cpf: formData.conjuge.cpf,
            rg: formData.conjuge.rg
          }
          : null,

        referencias: formData.referencias?.map((r: any) => ({
          nome: r.nome,
          endereco: {
            logradouro: r.endereco?.logradouro,
            bairro: r.endereco?.bairro,
            jardim: r.endereco?.jardim,
            cep: r.endereco?.cep,
            localizacao: r.endereco?.localizacao,
            cidade: r.endereco?.cidade,
            estado: r.endereco?.estado
          }
        })) ?? [],

        pagamento: formData.pagamento
          ? {
            valorTotal: formData.pagamento.valorTotal,
            sinal: formData.pagamento.sinal,
            dataInicio: toDateTime(formData.pagamento.dataInicio),
            numeroParcelas: formData.pagamento.numeroParcelas,
            parcelas: formData.pagamento.parcelas?.map((p: any) => ({
              numero: p.numero,
              valor: p.valor,
              vencimento: toDateTime(p.vencimento),
              statusPagamento: p.statusPagamento
            }))
          }
          : null
      }

      await axios.post("https://localhost:7195/api/cliente", payload, {
        headers: { "Content-Type": "application/json" }
      })

      toast({ title: "Sucesso!", description: "Cliente criado com sucesso." })
      // router.push("/clientes")
    } catch (err) {
      console.error(err)
      toast({ title: "Erro!", description: "Falha ao criar cliente." })
    } finally {
      setIsSubmitting(false)
    }
  }


  return (
    <div className="flex flex-col">
      <Header title="Novo Cliente" />
      <div className="flex-1 overflow-auto p-4 sm:p-6">
        <ClienteFormStepper onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  )
}
