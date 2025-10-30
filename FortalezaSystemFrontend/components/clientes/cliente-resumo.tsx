"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { formatToBRL } from "@/lib/utils"
import type { Endereco, DadosProfissionais, Conjuge, Pagamento, ProdutoSelecionado } from "@/lib/data/clientes"
import type { ValidationError } from "@/lib/validations/cliente-validation"

interface ClienteResumoProps {
  formData: any
  enderecos: Endereco[]
  dadosProfissionais: DadosProfissionais | undefined
  conjuge: Conjuge | undefined
  produtosSelecionados: ProdutoSelecionado[]
  pagamento: Pagamento | undefined
  validationErrors: ValidationError[]
}

export function ClienteResumo({
  formData,
  enderecos,
  dadosProfissionais,
  conjuge,
  produtosSelecionados,
  pagamento,
  validationErrors,
}: ClienteResumoProps) {
  const hasErrors = validationErrors.length > 0

  return (
    <div className="space-y-4">
      {hasErrors && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="font-semibold mb-2">Erros encontrados:</div>
            <ul className="list-disc list-inside space-y-1">
              {validationErrors.map((error, idx) => (
                <li key={idx} className="text-sm">
                  {error.message}
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {!hasErrors && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Todos os dados estão corretos e prontos para serem salvos!
          </AlertDescription>
        </Alert>
      )}

      {/* Dados Pessoais */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Dados Pessoais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-semibold">Nome:</span> {formData.nome}
            </div>
            <div>
              <span className="font-semibold">Email:</span> {formData.email}
            </div>
            <div>
              <span className="font-semibold">Telefone:</span> {formData.telefone}
            </div>
            <div>
              <span className="font-semibold">CPF:</span> {formData.cpf}
            </div>
            <div>
              <span className="font-semibold">RG:</span> {formData.rg}
            </div>
            <div>
              <span className="font-semibold">Data Nascimento:</span> {formData.dataNascimento}
            </div>
            <div>
              <span className="font-semibold">Estado Civil:</span> {formData.estadoCivil}
            </div>
            <div>
              <span className="font-semibold">Nacionalidade:</span> {formData.nacionalidade}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Endereços */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Endereços ({enderecos.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {enderecos.map((endereco, idx) => (
            <div key={idx} className="p-3 border rounded-lg bg-muted/50 text-sm">
              <p className="font-semibold mb-1">Endereço {idx + 1}</p>
              <p>
                {endereco.logradouro}, {endereco.numero}
              </p>
              <p>
                {endereco.bairro} - {endereco.cidade}, {endereco.estado}
              </p>
              <p>CEP: {endereco.cep}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Dados Profissionais */}
      {dadosProfissionais && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Dados Profissionais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="font-semibold">Profissão:</span> {dadosProfissionais.profissao}
              </div>
              <div>
                <span className="font-semibold">Empresa:</span> {dadosProfissionais.empresa}
              </div>
              <div>
                <span className="font-semibold">Salário:</span> {formatToBRL(dadosProfissionais.salario)}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cônjuge */}
      {conjuge && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Cônjuge</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="font-semibold">Nome:</span> {conjuge.nome}
              </div>
              <div>
                <span className="font-semibold">CPF:</span> {conjuge.cpf}
              </div>
              <div>
                <span className="font-semibold">Data Nascimento:</span> {conjuge.dataNascimento}
              </div>
              <div>
                <span className="font-semibold">Local de Trabalho:</span> {conjuge.localDeTrabalho}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Produtos */}
      {produtosSelecionados.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Produtos ({produtosSelecionados.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {produtosSelecionados.map((produto) => (
              <div key={produto.id} className="flex justify-between items-center p-3 border rounded-lg bg-muted/50">
                <div>
                  <p className="font-semibold">{produto.nome}</p>
                  <p className="text-sm text-muted-foreground">{formatToBRL(produto.preco)}</p>
                </div>
                <Badge variant="outline">{produto.quantidade}</Badge>
              </div>
            ))}
            <div className="border-t pt-3 mt-3">
              <div className="flex justify-between items-center font-semibold">
                <span>Total:</span>
                <span className="text-lg">
                  {formatToBRL(produtosSelecionados.reduce((acc, p) => acc + p.preco, 0))}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pagamento */}
      {pagamento && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informações de Pagamento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="font-semibold">Valor Total:</span> {formatToBRL(pagamento.valorTotal)}
              </div>
              <div>
                <span className="font-semibold">Sinal:</span> {formatToBRL(pagamento.sinal)}
              </div>
              <div>
                <span className="font-semibold">Data Início:</span> {pagamento.dataInicio}
              </div>
              <div>
                <span className="font-semibold">Parcelas:</span> {pagamento.numeroParcelas}x
              </div>
            </div>
            {pagamento.parcelas.length > 0 && (
              <div className="pt-3 border-t">
                <p className="font-semibold mb-2">Detalhes das Parcelas:</p>
                <div className="space-y-1 text-xs">
                  {pagamento.parcelas.map((parcela) => (
                    <div key={parcela.numero} className="flex justify-between">
                      <span>Parcela {parcela.numero}:</span>
                      <span>
                        {formatToBRL(parcela.valor)} - Vencimento: {parcela.vencimento}
                      </span>
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
