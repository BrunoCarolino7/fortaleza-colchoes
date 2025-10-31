"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { formatToBRL, formatCPF, formatRG, formatCEP, formatPhoneNumber } from "@/lib/utils"
import type { Cliente, Endereco, DadosProfissionais, Conjuge, Pagamento, ProdutoSelecionado } from "@/lib/data/clientes"
import { AlertCircle, CheckCircle2 } from "lucide-react"

interface ClienteResumoFinalProps {
  formData: Omit<
    Cliente,
    "id" | "dataCadastro" | "enderecos" | "referencias" | "estoque" | "pagamento" | "dadosProfissionais" | "conjuge"
  >
  enderecos: Endereco[]
  dadosProfissionais?: DadosProfissionais
  conjuge?: Conjuge
  produtosSelecionados: ProdutoSelecionado[]
  pagamento?: Pagamento
}

export function ClienteResumoFinal({
  formData,
  enderecos,
  dadosProfissionais,
  conjuge,
  produtosSelecionados,
  pagamento,
}: ClienteResumoFinalProps) {
  const totalProdutos = produtosSelecionados.reduce((acc, p) => acc + p.preco * p.quantidadeSelecionada, 0)

  const validacoes = {
    pessoal: !!(formData.nome && formData.email && formData.telefone && formData.cpf && formData.rg),
    enderecos: enderecos.length > 0 && enderecos.every((e) => e.logradouro && e.numero && e.cidade),
    profissional: !!dadosProfissionais?.profissao,
    produtos: produtosSelecionados.length > 0,
    pagamento: !!(pagamento?.valorTotal && pagamento?.parcelas.length > 0),
  }

  const todasValidas = Object.values(validacoes).every((v) => v)

  return (
    <div className="space-y-4">
      {!todasValidas && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Alguns campos obrigatórios estão faltando. Verifique os passos anteriores.
          </AlertDescription>
        </Alert>
      )}

      {todasValidas && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Todos os dados estão preenchidos corretamente. Você pode salvar o cliente.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Dados Pessoais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-muted-foreground">Nome</p>
              <p className="font-medium">{formData.nome}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Email</p>
              <p className="font-medium">{formData.email}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Telefone</p>
              <p className="font-medium">{formatPhoneNumber(formData.telefone)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">CPF</p>
              <p className="font-medium">{formatCPF(formData.cpf)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">RG</p>
              <p className="font-medium">{formatRG(formData.rg)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Data de Nascimento</p>
              <p className="font-medium">{new Date(formData.dataNascimento).toLocaleDateString("pt-BR")}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Endereços ({enderecos.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {enderecos.map((endereco, index) => (
            <div key={index} className="p-4 border rounded-lg bg-muted/50 text-sm space-y-2">
              <p className="font-semibold text-base">Endereço {index + 1}</p>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-muted-foreground text-xs">Logradouro</p>
                  <p className="font-medium">
                    {endereco.logradouro}, {endereco.numero}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Bairro</p>
                  <p className="font-medium">{endereco.bairro}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Cidade</p>
                  <p className="font-medium">
                    {endereco.cidade}, {endereco.estado}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">CEP</p>
                  <p className="font-medium">{formatCEP(endereco.cep)}</p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {dadosProfissionais && (
        <Card>
          <CardHeader>
            <CardTitle>Dados Profissionais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Profissão</p>
                  <p className="font-medium">{dadosProfissionais.profissao}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Empresa</p>
                  <p className="font-medium">{dadosProfissionais.empresa || "-"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Salário</p>
                  <p className="font-medium">
                    {dadosProfissionais.salario ? formatToBRL(dadosProfissionais.salario) : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Telefone</p>
                  <p className="font-medium">{formatPhoneNumber(dadosProfissionais.telefone)}</p>
                </div>
              </div>

              {dadosProfissionais.enderecoEmpresa && (
                <div className="pt-3 border-t">
                  <p className="font-semibold text-sm mb-2">Endereço da Empresa</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground text-xs">Logradouro</p>
                      <p className="font-medium">
                        {dadosProfissionais.enderecoEmpresa.logradouro}, {dadosProfissionais.enderecoEmpresa.numero}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Bairro</p>
                      <p className="font-medium">{dadosProfissionais.enderecoEmpresa.bairro}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Cidade</p>
                      <p className="font-medium">
                        {dadosProfissionais.enderecoEmpresa.cidade}, {dadosProfissionais.enderecoEmpresa.estado}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">CEP</p>
                      <p className="font-medium">{formatCEP(dadosProfissionais.enderecoEmpresa.cep)}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {conjuge && (
        <Card>
          <CardHeader>
            <CardTitle>Cônjuge</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-muted-foreground">Nome</p>
                <p className="font-medium">{conjuge.nome}</p>
              </div>
              <div>
                <p className="text-muted-foreground">CPF</p>
                <p className="font-medium">{formatCPF(conjuge.cpf)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Produtos ({produtosSelecionados.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {produtosSelecionados.map((produto) => (
            <div
              key={produto.id}
              className="flex justify-between items-center p-3 border rounded-lg bg-muted/50 text-sm"
            >
              <div>
                <p className="font-medium">{produto.nome}</p>
                <p className="text-muted-foreground">
                  {produto.quantidadeSelecionada}x {formatToBRL(produto.preco)}
                </p>
              </div>
              <p className="font-semibold">{formatToBRL(produto.preco * produto.quantidadeSelecionada)}</p>
            </div>
          ))}
          <div className="border-t pt-3 mt-3">
            <div className="flex justify-between items-center font-semibold">
              <span>Total de Produtos:</span>
              <span className="text-lg">{formatToBRL(totalProdutos)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {pagamento && (
        <Card>
          <CardHeader>
            <CardTitle>Pagamento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Valor Total</p>
                <p className="font-medium">{formatToBRL(pagamento.valorTotal)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Sinal</p>
                <p className="font-medium">{formatToBRL(pagamento.sinal)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Número de Parcelas</p>
                <p className="font-medium">{pagamento.numeroParcelas}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Data de Início</p>
                <p className="font-medium">{new Date(pagamento.dataInicio).toLocaleDateString("pt-BR")}</p>
              </div>
            </div>

            {pagamento.parcelas.length > 0 && (
              <div className="pt-4 border-t">
                <p className="font-semibold mb-3 text-sm">Parcelas</p>
                <div className="space-y-2">
                  {pagamento.parcelas.map((parcela) => (
                    <div
                      key={parcela.numero}
                      className="flex justify-between items-center text-sm p-2 bg-muted/50 rounded"
                    >
                      <div>
                        <p className="font-medium">Parcela {parcela.numero}</p>
                        <p className="text-muted-foreground text-xs">
                          Vencimento: {new Date(parcela.vencimento || "").toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatToBRL(parcela.valor)}</p>
                        <p className="text-xs text-muted-foreground">
                          {parcela.statusPagamento === 1 ? "Pendente" : "✓ Pago"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
