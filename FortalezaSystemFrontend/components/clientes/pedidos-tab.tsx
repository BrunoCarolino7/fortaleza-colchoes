"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { formatToBRL, formatDateBR } from "@/lib/utils"
import { useFetch } from "@/hooks/use-request"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"
import type { Cliente } from "@/app/interfaces/geral"

export interface Pedido {
  id: number
  clienteId: number
  itens: ItemPedido[]
}

export interface ItemPedido {
  id: number
  produtoId: number
  quantidade: number
  precoUnitario: number
  pagamento: Pagamento
}

export interface Pagamento {
  id?: number
  valorTotal: number
  sinal: number
  dataInicio: string
  numeroParcelas: number
  parcelas: Parcela[]
}

export interface Parcela {
  numero?: number
  valor?: number
  vencimento?: string
  statusPagamento?: EStatusPagamento
}

export enum EStatusPagamento {
  Pendente = 1,
  Pago = 2,
  Cancelado = 3,
  Estornado = 4,
}

interface PedidosTabProps {
  cliente: Cliente
}

export function PedidosTab({ cliente }: PedidosTabProps) {
  const id = cliente.id
  const api = process.env.NEXT_PUBLIC_API
  const { toast } = useToast()
  const { data } = useFetch<Pedido[]>(id ? `${api}/pedido/cliente/${id}` : "", { enabled: !!id })

  const [selectedPedidoId, setSelectedPedidoId] = useState<string | null>(null)
  const [pedidos, setPedidos] = useState<Pedido[]>([])

  useEffect(() => {
    if (data) setPedidos(data)
  }, [data])

  if (!pedidos || pedidos.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">Nenhum pedido cadastrado</CardContent>
      </Card>
    )
  }

  const pedidoAtual = selectedPedidoId ? pedidos.find((p) => p.id === Number(selectedPedidoId)) : pedidos[0]

  if (!pedidoAtual) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">Pedido não encontrado</CardContent>
      </Card>
    )
  }

  const statusBadge = (status?: EStatusPagamento) => {
    switch (status) {
      case EStatusPagamento.Pago:
        return <Badge className="bg-green-500 hover:bg-green-600">Pago</Badge>
      case EStatusPagamento.Pendente:
        return (
          <Badge variant="outline" className="border-yellow-500 text-yellow-600">
            Pendente
          </Badge>
        )
      case EStatusPagamento.Cancelado:
        return (
          <Badge variant="outline" className="border-red-500 text-red-600">
            Cancelado
          </Badge>
        )
      case EStatusPagamento.Estornado:
        return (
          <Badge variant="outline" className="border-purple-500 text-purple-600">
            Estornado
          </Badge>
        )
      default:
        return null
    }
  }

  const handleParcelaStatusChange = async (
    pedidoId: number,
    produtoId: number,
    parcelaNumero: number,
    newStatus: number,
  ) => {
    const prev = JSON.parse(JSON.stringify(pedidos)) as Pedido[]

    const updated = pedidos.map((p) => {
      if (p.id !== pedidoId) return p
      return {
        ...p,
        itens: p.itens.map((i) => {
          if (i.produtoId !== produtoId) return i
          return {
            ...i,
            pagamento: {
              ...i.pagamento,
              parcelas: i.pagamento.parcelas.map((parcela) =>
                parcela.numero === parcelaNumero
                  ? { ...parcela, statusPagamento: newStatus as EStatusPagamento }
                  : parcela,
              ),
            },
          }
        }),
      }
    })

    setPedidos(updated)

    const pedido = pedidos.find((p) => p.id === pedidoId)
    const item = pedido?.itens.find((i) => i.produtoId === produtoId)
    const informacoesPagamentoId = item?.pagamento?.id

    if (!informacoesPagamentoId) {
      setPedidos(prev)
      toast({
        title: "Erro",
        description: "Não foi possível localizar o pagamento deste produto.",
        variant: "destructive",
      })
      return
    }

    try {
      await axios.put(`${api}/pedido/status?InformacoesPagamentoId=${informacoesPagamentoId}&ParcelaId=${parcelaNumero}`,
        newStatus,
        { headers: { "Content-Type": "application/json" } },
      )
      toast({ title: "Sucesso!", description: `Status da parcela ${parcelaNumero} atualizado com sucesso.` })
    } catch (error) {
      setPedidos(prev)
      toast({ title: "Erro", description: "Falha ao atualizar o status da parcela.", variant: "destructive" })
    }
  }

  const renderPedidoDetalhes = (pedido: Pedido) => {
    return (
      <div className="space-y-6">
        {pedido.itens.map((item) => {
          const pagamento = item.pagamento
          const parcelas = pagamento?.parcelas ?? []

          const totalPago = parcelas
            .filter((p) => p.statusPagamento === EStatusPagamento.Pago)
            .reduce((sum, p) => sum + (p.valor ?? 0), 0)

          const totalPendente = parcelas
            .filter((p) => p.statusPagamento === EStatusPagamento.Pendente)
            .reduce((sum, p) => sum + (p.valor ?? 0), 0)

          return (
            <Card key={item.id} className="border shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">
                  Produto #{item.produtoId} — Quantidade: {item.quantidade}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Valor Total</p>
                    <p className="text-lg font-semibold">{formatToBRL(pagamento?.valorTotal)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Sinal (Entrada)</p>
                    <p className="text-lg font-semibold">{formatToBRL(pagamento?.sinal)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Pago</p>
                    <p className="text-lg font-semibold text-green-600">{formatToBRL(totalPago)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Pendente</p>
                    <p className="text-lg font-semibold text-yellow-600">{formatToBRL(totalPendente)}</p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Data de Início</p>
                    <p className="font-medium">{formatDateBR(pagamento?.dataInicio)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Número de Parcelas</p>
                    <p className="font-medium">{pagamento?.numeroParcelas}</p>
                  </div>
                </div>

                {parcelas.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold">Parcelas</h4>
                    {parcelas.map((parcela, index) => (
                      <div
                        key={index}
                        className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-end sm:justify-between"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold">Parcela {parcela.numero}</span>
                            {statusBadge(parcela.statusPagamento)}
                          </div>
                          <div className="grid gap-2 sm:grid-cols-2 text-sm">
                            <div>
                              <p className="text-muted-foreground">Valor</p>
                              <p className="font-medium">{formatToBRL(parcela.valor)}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Vencimento</p>
                              <p className="font-medium">
                                {parcela.vencimento ? formatDateBR(parcela.vencimento) : "-"}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2 w-full sm:w-48">
                          <Label className="text-xs">Alterar Status</Label>
                          <Select
                            value={parcela.statusPagamento?.toString() ?? "0"}
                            onValueChange={(value) =>
                              handleParcelaStatusChange(pedido.id, item.produtoId, parcela.numero ?? 0, Number(value))
                            }
                          >
                            <SelectTrigger className="text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">Pendente</SelectItem>
                              <SelectItem value="2">Pago</SelectItem>
                              <SelectItem value="3">Cancelado</SelectItem>
                              <SelectItem value="4">Estornado</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
        <div className="flex flex-col gap-2 w-full sm:max-w-md">
          <label className="text-sm font-medium">Selecione um Pedido</label>
          <Select value={selectedPedidoId || String(pedidoAtual.id)} onValueChange={setSelectedPedidoId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Escolha um pedido" />
            </SelectTrigger>
            <SelectContent>
              {pedidos.map((pedido) => {
                const total = pedido.itens.reduce((sum, i) => sum + (i.pagamento?.valorTotal ?? 0), 0)
                return (
                  <SelectItem key={pedido.id} value={String(pedido.id)}>
                    Pedido #{pedido.id} - {formatToBRL(total)}
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        </div>

        <Link href={`/pedidos/novo?clienteId=${cliente.id}`}>
          <Button>Novo Pedido</Button>
        </Link>
      </div>

      {renderPedidoDetalhes(pedidoAtual)}
    </div>
  )
}
