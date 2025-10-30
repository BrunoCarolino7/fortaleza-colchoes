"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2Icon } from "@/components/icons"
import { formatToBRL } from "@/lib/utils"
import type { Pagamento, Parcela, ProdutoSelecionado } from "@/lib/data/clientes"
import { NumericFormat } from "react-number-format"

interface PagamentoFormProps {
  pagamento?: Pagamento
  produtosSelecionados: ProdutoSelecionado[]
  onChange: (pagamento: Pagamento | undefined) => void
}

export function PagamentoForm({ pagamento, produtosSelecionados, onChange }: PagamentoFormProps) {
  const calcularTotalProdutos = () =>
    produtosSelecionados.reduce((acc, produto) => acc + produto.preco * produto.quantidadeSelecionada, 0)

  const gerarParcelas = () => {
    if (!pagamento) return

    const { valorTotal, sinal, numeroParcelas, dataInicio } = pagamento
    const valorRestante = valorTotal - sinal
    const valorParcela = valorRestante / numeroParcelas
    const parcelas: Parcela[] = []
    const dataBase = new Date(dataInicio)

    for (let i = 1; i <= numeroParcelas; i++) {
      const vencimento = new Date(dataBase)
      vencimento.setMonth(vencimento.getMonth() + i)
      parcelas.push({
        numero: i,
        valor: Number(valorParcela.toFixed(2)),
        vencimento: vencimento.toISOString().split("T")[0],
        statusPagamento: 1,
      })
    }

    onChange({ ...pagamento, parcelas })
  }

  const updateParcela = (index: number, parcela: Parcela) => {
    if (!pagamento) return
    const novas = [...pagamento.parcelas]
    novas[index] = parcela
    onChange({ ...pagamento, parcelas: novas })
  }

  const removeParcela = (index: number) => {
    if (!pagamento) return
    onChange({ ...pagamento, parcelas: pagamento.parcelas.filter((_, i) => i !== index) })
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Informações de Pagamento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!pagamento ? (
            <div className="text-center py-8 text-muted-foreground">
              Selecione um produto para receber informações de pagamento
            </div>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Valor Total</Label>
                  <Input
                    type="text"
                    value={formatToBRL(pagamento.valorTotal)}
                    readOnly
                    className="font-medium bg-gray-100 cursor-not-allowed"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Sinal (Entrada)</Label>
                  <NumericFormat
                    value={pagamento.sinal}
                    onValueChange={(values) => onChange({ ...pagamento, sinal: values.floatValue || 0 })}
                    thousandSeparator="."
                    decimalSeparator=","
                    prefix="R$ "
                    customInput={Input}
                    placeholder="R$ 0,00"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Data de Início</Label>
                  <Input
                    type="date"
                    value={pagamento.dataInicio}
                    onChange={(e) => onChange({ ...pagamento, dataInicio: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Número de Parcelas</Label>
                  <Input
                    type="number"
                    min="1"
                    value={pagamento.numeroParcelas}
                    onChange={(e) =>
                      onChange({
                        ...pagamento,
                        numeroParcelas: Number.parseInt(e.target.value),
                      })
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
              </div>

              {pagamento.parcelas.length > 0 && (
                <div className="space-y-4 pt-4">
                  <h3 className="font-semibold text-base sm:text-lg">Parcelas</h3>
                  {pagamento.parcelas.map((p, i) => (
                    <Card key={i}>
                      <CardContent className="pt-6">
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 items-end">
                          <div className="space-y-2">
                            <Label>Número</Label>
                            <Input
                              type="number"
                              value={p.numero}
                              onChange={(e) =>
                                updateParcela(i, {
                                  ...p,
                                  numero: Number.parseInt(e.target.value),
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Valor</Label>
                            <Input
                              type="text"
                              value={formatToBRL(p.valor)}
                              readOnly
                              className="bg-gray-100 cursor-not-allowed font-medium"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Vencimento</Label>
                            <Input
                              type="date"
                              value={p.vencimento || ""}
                              onChange={(e) => updateParcela(i, { ...p, vencimento: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Status</Label>
                            <Select
                              value={p.statusPagamento.toString()}
                              onValueChange={(v) => updateParcela(i, { ...p, statusPagamento: Number(v) })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">Pendente</SelectItem>
                                <SelectItem value="2">Pago</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex justify-end">
                            <Button type="button" variant="ghost" size="icon" onClick={() => removeParcela(i)}>
                              <Trash2Icon className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
