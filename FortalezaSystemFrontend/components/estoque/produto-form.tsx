"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react" // 👈 ícone do spinner
import type { Produto } from "@/lib/data/estoque"

interface ProdutoFormProps {
  produto?: Produto
  onSubmit: (data: Omit<Produto, "id" | "dataCadastro">) => Promise<void> | void
}

export function ProdutoForm({ produto, onSubmit }: ProdutoFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    nome: produto?.nome || "",
    categoria: produto?.categoria || "",
    tamanho: produto?.tamanho || "",
    preco: produto?.preco || 0,
    quantidade: produto?.quantidade || 0,
    estoqueMinimo: produto?.estoqueMinimo || 10,
    fornecedor: produto?.fornecedor || "",
    descricao: produto?.descricao || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      await onSubmit(formData)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.type === "number" ? Number.parseFloat(e.target.value) : e.target.value
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: value,
    }))
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Informações do Produto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="nome">Nome do Produto</Label>
              <Input id="nome" name="nome" value={formData.nome} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="categoria">Categoria</Label>
              <Input id="categoria" name="categoria" value={formData.categoria} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tamanho">Tamanho</Label>
              <Input id="tamanho" name="tamanho" value={formData.tamanho} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="preco">Preço (R$)</Label>
              <Input
                id="preco"
                name="preco"
                type="number"
                step="0.01"
                value={formData.preco}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fornecedor">Fornecedor</Label>
              <Input id="fornecedor" name="fornecedor" value={formData.fornecedor} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantidade">Quantidade em Estoque</Label>
              <Input
                id="quantidade"
                name="quantidade"
                type="number"
                value={formData.quantidade}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="estoqueMinimo">Estoque Mínimo</Label>
              <Input
                id="estoqueMinimo"
                name="estoqueMinimo"
                type="number"
                value={formData.estoqueMinimo}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea id="descricao" name="descricao" value={formData.descricao} onChange={handleChange} rows={3} />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex justify-center items-center min-w-[90px]"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Salvar"
              )}
            </Button>

            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
              Cancelar
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
