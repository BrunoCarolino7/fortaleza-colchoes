export interface Cliente {
  id: number
  nome?: string | null
  filiacao?: string | null
  dataNascimento?: string | null
  estadoCivil?: string | null
  nacionalidade?: string | null
  naturalidade?: string | null
  email?: string | null
  telefone?: string | null
  documento?: {
    cpf?: string | null
    rg?: string | null
  } | null
  dadosProfissionais?: {
    empresa?: string | null
    telefone?: string | null
    profissao?: string | null
    salario?: number | null
    enderecoEmpresa?: {
      logradouro?: string | null
      bairro?: string | null
      cidade?: string | null
      estado?: string | null
      cep?: string | null
      numero?: string | null
    } | null
  } | null
  conjuge?: {
    nome?: string | null
    dataNascimento?: string | null
    naturalidade?: string | null
    localDeTrabalho?: string | null
    documento?: {
      cpf?: string | null
      rg?: string | null
    } | null
  } | null
  pagamento?: {
    valorTotal?: number | null
    sinal?: number | null
    dataInicio?: string | null
    numeroParcelas?: number | null
    aReceber?: number | null
    totalPago?: number | null
    totalCancelado?: number | null
  } | null
  assinatura?: {
    assinaturaCliente?: string | null
  } | null
  enderecos?:
    | {
        logradouro?: string | null
        bairro?: string | null
        cidade?: string | null
        estado?: string | null
        cep?: string | null
        numero?: string | null
      }[]
    | null
  referencias?:
    | {
        nome?: string | null
        telefone?: string | null
      }[]
    | null
}

// -----------------------------
// Interfaces gerais de erro e estoque
// -----------------------------

export interface AxiosErrorInfo {
  status?: number
  message: string
  name?: string
  code?: string
  stack?: string
}

export interface EstoqueTotalAgregado {
  total: number
  baixoEstoque: number
  semEstoque?: number
  emEstoque?: number
  data?: {
    id: number
    categoria: string
    nome: string
    preco: number
    quantidade: number
    tamanho: string
    estoqueMinimo?: number
  }[]
}

// -----------------------------
// Domínio de Pedidos
// -----------------------------

export interface Pedido {
  id: number
  clienteId: number
  informacoesPagamento: InformacoesPagamento
}

export interface InformacoesPagamento {
  valorTotal: number
  sinal: number
  dataInicio: string
  numeroParcelas: number
  aReceber: number
  totalPago: number
  totalCancelado: number
  parcelas: Parcela[]
  produto: Estoque | null // ✅ agora é um único objeto (não array)
}

export interface Parcela {
  numero: number
  valor: number
  vencimento: string
  statusPagamento: EStatusPagamento
}

// -----------------------------
// Estoque
// -----------------------------

export interface Estoque {
  id: number
  nome: string
  categoria: string
  tamanho: string
  preco: number
  quantidade: number
  statusEstoque: number
}

// -----------------------------
// Enum e tipos auxiliares
// -----------------------------

export enum EStatusPagamento {
  Pendente = 1,
  Pago = 2,
  Cancelado = 3,
  Estornado = 4,
}

export type PedidosResponse = Pedido[]
