"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2Icon } from "@/components/icons"
import { PatternFormat } from "react-number-format"
import type { Endereco } from "@/lib/data/clientes"
import { useState } from "react"

interface EnderecoFormProps {
  endereco: Endereco
  onChange: (endereco: Endereco) => void
  onRemove?: () => void
  title?: string
  showRemove?: boolean
}

export function EnderecoForm({
  endereco,
  onChange,
  onRemove,
  title = "Endereço",
  showRemove = true,
}: EnderecoFormProps) {
  const [loadingCep, setLoadingCep] = useState(false)

  const handleChange = (field: keyof Endereco, value: string) => {
    const finalValue = field === "estado" ? value.toUpperCase() : value
    onChange({ ...endereco, [field]: finalValue })
  }

  const handleCepChange = async (cepValue: string) => {
    handleChange("cep", cepValue)

    // Only fetch if CEP is complete (8 digits)
    if (cepValue.replace(/\D/g, "").length === 8) {
      setLoadingCep(true)
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cepValue.replace(/\D/g, "")}/json/`)
        const data = await response.json()

        if (!data.erro) {
          onChange({
            ...endereco,
            cep: cepValue,
            logradouro: data.logradouro || endereco.logradouro,
            bairro: data.bairro || endereco.bairro,
            cidade: data.localidade || endereco.cidade,
            estado: data.uf || "SP",
          })
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error)
      } finally {
        setLoadingCep(false)
      }
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">{title}</CardTitle>
        {showRemove && onRemove && (
          <Button type="button" variant="ghost" size="icon" onClick={onRemove}>
            <Trash2Icon className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 ">
            <Label>Logradouro</Label>
            <Input value={endereco.logradouro} onChange={(e) => handleChange("logradouro", e.target.value)} required />
          </div>
          <div className="space-y-2 w-[150px]">
            <Label>Número</Label>
            <Input
              type="number"
              value={endereco.numero}
              onChange={(e) => handleChange("numero", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Bairro</Label>
            <Input value={endereco.bairro} onChange={(e) => handleChange("bairro", e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>CEP</Label>
            <PatternFormat
              format="#####-###"
              value={endereco.cep}
              onValueChange={(values) => handleCepChange(values.value)}
              customInput={Input}
              placeholder="00000-000"
              required
              disabled={loadingCep}
            />
          </div>
          <div className="space-y-2">
            <Label>Referência</Label>
            <Input
              value={endereco.localizacao}
              onChange={(e) => handleChange("localizacao", e.target.value)}
              placeholder="Ex: Apto 101, Bloco A"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Cidade</Label>
            <Input value={endereco.cidade} onChange={(e) => handleChange("cidade", e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Estado</Label>
            <Input
              value={endereco.estado}
              onChange={(e) => handleChange("estado", e.target.value)}
              maxLength={2}
              required
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
