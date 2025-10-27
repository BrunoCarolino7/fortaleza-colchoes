"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatToBRL, formatDateBR } from "@/lib/utils"
import { Cliente, EStatusPagamento, PedidosResponse } from "@/app/interfaces/geral"
import { useFetch } from "@/hooks/use-request"

interface PedidosTabProps {
  cliente: Cliente
}

export function PedidosTab({ cliente }: PedidosTabProps) {
  const id = cliente.id
  const { data, error, loading } = useFetch<PedidosResponse>(
    id ? `https://localhost:7195/api/pedido/cliente/${id}` : "",
    { enabled: !!id }
  )

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Nenhum pedido cadastrado
        </CardContent>
      </Card>
    )
  }

  
  const statusPagamento = (status: EStatusPagamento) => {
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

  return (
    <div className="space-y-10">
      {data.map((pedido) => {
        const pagamento = pedido.informacoesPagamento
        const parcelas = pagamento.parcelas ?? []

        const totalPago =
          parcelas
            .filter((p) => p.statusPagamento === EStatusPagamento.Pago)
            .reduce((sum, p) => sum + (p.valor ?? 0), 0) ?? 0

        const totalPendente =
          parcelas
            .filter((p) => p.statusPagamento === EStatusPagamento.Pendente)
            .reduce((sum, p) => sum + (p.valor ?? 0), 0) ?? 0

        return (
          <div key={pedido.id} className="space-y-6">
            {/* Título do Pedido */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Pedido #{pedido.id}</h2>
              <Badge variant="secondary" className="text-xs">
                Cliente ID: {pedido.clienteId}
              </Badge>
            </div>

            {/* Resumo do Pedido */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="text-sm text-muted-foreground">Valor Total</p>
                  <p className="text-lg font-semibold">
                    {formatToBRL(pagamento.valorTotal)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Sinal (Entrada)</p>
                  <p className="text-lg font-semibold">
                    {formatToBRL(pagamento.sinal)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Pago</p>
                  <p className="text-lg font-semibold text-green-600">
                    {formatToBRL(totalPago)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Pendente</p>
                  <p className="text-lg font-semibold text-yellow-600">
                    {formatToBRL(totalPendente)}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Informações do Pagamento */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Informações do Pagamento</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Data de Início</p>
                  <p className="font-medium">
                    {formatDateBR(pagamento.dataInicio)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Número de Parcelas</p>
                  <p className="font-medium">{pagamento.numeroParcelas}</p>
                </div>
              </CardContent>
            </Card>

            {/* Parcelas */}
            {parcelas.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Parcelas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {parcelas.map((parcela, index) => (
                      <div
                        key={index}
                        className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold">
                              Parcela {parcela.numero}
                            </span>
                            {statusPagamento(parcela.statusPagamento)}
                          </div>
                          <div className="grid gap-2 sm:grid-cols-2 text-sm">
                            <div>
                              <p className="text-muted-foreground">Valor</p>
                              <p className="font-medium">
                                {formatToBRL(parcela.valor)}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Vencimento</p>
                              <p className="font-medium">
                                {parcela.vencimento
                                  ? formatDateBR(parcela.vencimento)
                                  : "-"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )
      })}
    </div>
  )
}
