import type { Endereco, DadosProfissionais, Conjuge, Pagamento, ProdutoSelecionado } from "@/lib/data/clientes"

export interface ValidationError {
  field: string
  message: string
}

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
}

export function validateEndereco(endereco: Endereco): ValidationError[] {
  const errors: ValidationError[] = []

  if (!endereco.logradouro?.trim()) errors.push({ field: "logradouro", message: "Logradouro é obrigatório" })
  if (!endereco.numero?.trim()) errors.push({ field: "numero", message: "Número é obrigatório" })
  if (!endereco.bairro?.trim()) errors.push({ field: "bairro", message: "Bairro é obrigatório" })
  if (!endereco.cep?.trim()) errors.push({ field: "cep", message: "CEP é obrigatório" })
  if (!endereco.cidade?.trim()) errors.push({ field: "cidade", message: "Cidade é obrigatória" })
  if (!endereco.estado?.trim()) errors.push({ field: "estado", message: "Estado é obrigatório" })

  return errors
}

export function validateDadosPessoais(formData: any): ValidationError[] {
  const errors: ValidationError[] = []

  if (!formData.nome?.trim()) errors.push({ field: "nome", message: "Nome é obrigatório" })
  if (!formData.email?.trim()) errors.push({ field: "email", message: "Email é obrigatório" })
  if (!formData.telefone?.trim()) errors.push({ field: "telefone", message: "Telefone é obrigatório" })
  if (!formData.filiacao?.trim()) errors.push({ field: "filiacao", message: "Filiação é obrigatória" })
  if (!formData.dataNascimento?.trim())
    errors.push({ field: "dataNascimento", message: "Data de nascimento é obrigatória" })
  if (!formData.cpf?.trim()) errors.push({ field: "cpf", message: "CPF é obrigatório" })
  if (!formData.rg?.trim()) errors.push({ field: "rg", message: "RG é obrigatório" })
  if (!formData.nacionalidade?.trim()) errors.push({ field: "nacionalidade", message: "Nacionalidade é obrigatória" })
  if (!formData.naturalidade?.trim()) errors.push({ field: "naturalidade", message: "Naturalidade é obrigatória" })

  return errors
}

export function validateEnderecos(enderecos: Endereco[]): ValidationError[] {
  const errors: ValidationError[] = []

  if (!enderecos || enderecos.length === 0) {
    errors.push({ field: "enderecos", message: "Pelo menos um endereço é obrigatório" })
    return errors
  }

  enderecos.forEach((endereco, index) => {
    const enderecosErrors = validateEndereco(endereco)
    enderecosErrors.forEach((error) => {
      errors.push({ field: `endereco_${index}_${error.field}`, message: error.message })
    })
  })

  return errors
}

export function validateDadosProfissionais(dadosProfissionais: DadosProfissionais | undefined): ValidationError[] {
  const errors: ValidationError[] = []

  if (!dadosProfissionais) return errors

  if (!dadosProfissionais.profissao?.trim()) errors.push({ field: "profissao", message: "Profissão é obrigatória" })

  if (dadosProfissionais.enderecoEmpresa) {
    const enderecoErrors = validateEndereco(dadosProfissionais.enderecoEmpresa)
    enderecoErrors.forEach((error) => {
      errors.push({ field: `enderecoEmpresa_${error.field}`, message: error.message })
    })
  }

  return errors
}

export function validateConjuge(conjuge: Conjuge | undefined): ValidationError[] {
  const errors: ValidationError[] = []

  if (!conjuge) return errors

  if (!conjuge.nome?.trim()) errors.push({ field: "conjuge_nome", message: "Nome do cônjuge é obrigatório" })
  if (!conjuge.dataNascimento?.trim())
    errors.push({ field: "conjuge_dataNascimento", message: "Data de nascimento é obrigatória" })
  if (!conjuge.naturalidade?.trim())
    errors.push({ field: "conjuge_naturalidade", message: "Naturalidade é obrigatória" })
  if (!conjuge.localDeTrabalho?.trim())
    errors.push({ field: "conjuge_localDeTrabalho", message: "Local de trabalho é obrigatório" })
  if (!conjuge.cpf?.trim()) errors.push({ field: "conjuge_cpf", message: "CPF é obrigatório" })
  if (!conjuge.rg?.trim()) errors.push({ field: "conjuge_rg", message: "RG é obrigatório" })

  return errors
}

export function validatePagamento(
  pagamento: Pagamento | undefined,
  produtosSelecionados: ProdutoSelecionado[],
): ValidationError[] {
  const errors: ValidationError[] = []

  if (produtosSelecionados.length === 0) return errors

  if (!pagamento) {
    errors.push({ field: "pagamento", message: "Informações de pagamento são obrigatórias" })
    return errors
  }

  if (pagamento.valorTotal <= 0) errors.push({ field: "valorTotal", message: "Valor total deve ser maior que 0" })
  if (pagamento.sinal < 0) errors.push({ field: "sinal", message: "Sinal não pode ser negativo" })
  if (pagamento.sinal > pagamento.valorTotal)
    errors.push({ field: "sinal", message: "Sinal não pode ser maior que o valor total" })
  if (!pagamento.dataInicio?.trim()) errors.push({ field: "dataInicio", message: "Data de início é obrigatória" })
  if (pagamento.numeroParcelas <= 0)
    errors.push({ field: "numeroParcelas", message: "Número de parcelas deve ser maior que 0" })

  return errors
}

export function validateClienteForm(
  formData: any,
  enderecos: Endereco[],
  dadosProfissionais: DadosProfissionais | undefined,
  conjuge: Conjuge | undefined,
  produtosSelecionados: ProdutoSelecionado[],
  pagamento: Pagamento | undefined,
  step: number,
): ValidationResult {
  const errors: ValidationError[] = []

  switch (step) {
    case 1:
      errors.push(...validateDadosPessoais(formData))
      break
    case 2:
      errors.push(...validateEnderecos(enderecos))
      break
    case 3:
      errors.push(...validateDadosProfissionais(dadosProfissionais))
      break
    case 4:
      errors.push(...validateConjuge(conjuge))
      break
    case 5:
      if (produtosSelecionados.length === 0) {
        errors.push({ field: "produtos", message: "Selecione pelo menos um produto" })
      }
      break
    case 6:
      errors.push(...validatePagamento(pagamento, produtosSelecionados))
      break
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export function validateClienteFormFinal(
  formData: any,
  enderecos: Endereco[],
  dadosProfissionais: DadosProfissionais | undefined,
  conjuge: Conjuge | undefined,
  produtosSelecionados: ProdutoSelecionado[],
  pagamento: Pagamento | undefined,
): ValidationResult {
  const errors: ValidationError[] = []

  errors.push(...validateDadosPessoais(formData))
  errors.push(...validateEnderecos(enderecos))
  errors.push(...validateDadosProfissionais(dadosProfissionais))
  errors.push(...validateConjuge(conjuge))

  if (produtosSelecionados.length === 0) {
    errors.push({ field: "produtos", message: "Selecione pelo menos um produto" })
  } else {
    errors.push(...validatePagamento(pagamento, produtosSelecionados))
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}
