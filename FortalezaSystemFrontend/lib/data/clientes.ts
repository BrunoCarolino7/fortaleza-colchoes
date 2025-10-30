export interface Endereco {
  id?: string
  logradouro: string
  numero: string
  bairro: string
  cep: string
  localizacao: string
  cidade: string
  estado: string
}

export interface DadosProfissionais {
  id?: string
  empresa: string
  profissao: string  
  telefone: string
  salario: number
  enderecoEmpresa: Endereco
}

export interface Conjuge {
  id?: string
  nome: string
  dataNascimento: string
  naturalidade: string
  localDeTrabalho: string
  cpf: string
  rg: string
}

export interface Referencia {
  id?: string
  nome: string
  endereco: Endereco
}

export interface Parcela {
  numero: number
  valor: number
  vencimento: string | null
  statusPagamento: number
}

export interface Pagamento {
  id?: string
  valorTotal: number
  sinal: number
  dataInicio: string
  numeroParcelas: number
  parcelas: Parcela[]
}

export interface ProdutoSelecionado {
  id: string
  nome: string
  preco: number
  quantidade: number
  quantidadeSelecionada: number
}

export interface Pedido {
  id: number
  ClienteId: number
  InformacoesPagamentoId: number
  parcelaId: number
}

export interface ProdutosSelecionados extends Array<ProdutoSelecionado> {}

export interface Cliente {
  id: string
  nome: string
  email: string
  telefone: string
  filiacao: string
  nacionalidade: string
  naturalidade: string
  estadoCivil: string
  dataNascimento: string
  documento?: {
    cpf?: string | null
    rg?: string | null
  } | null
  enderecos: Endereco[]
  dadosProfissionais?: DadosProfissionais
  conjuge?: Conjuge
  referencias: Referencia[]
  estoque?: ProdutoSelecionado[]
  assinatura?: {
    assinaturaCliente?: string | null
  } | null
  pagamento?: Pagamento
  dataCadastro: string
}
