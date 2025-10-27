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
    enderecos?: {
        logradouro?: string | null
        bairro?: string | null
        cidade?: string | null
        estado?: string | null
        cep?: string | null
        numero?: string | null
    }[] | null
    referencias?: {
        nome?: string | null
        telefone?: string | null
    }[] | null
}

export interface AxiosErrorInfo {
    status?: number
    message: string
    name?: string
    code?: string
    stack?: string
}

export interface EstoqueTotalAgregado {
    data: {
        id: number
        categoria: string
        nome: string
        preco: number
        quantidade: number
        tamanho: string
        estoqueMinimo?: number
    }[]
    baixoEstoque: number
    semEstoque: number
    emEstoque: number
    total: number
}
export interface Produto {
    id: string
    nome: string
    categoria: string
    tamanho: string
    preco: number
    quantidade: number
    estoqueMinimo: number
    fornecedor: string
    descricao: string
    dataCadastro: string
}
export interface Pedido {
  id: number;
  clienteId: number;
  informacoesPagamento: InformacoesPagamento;
}

export interface InformacoesPagamento {
  valorTotal: number;
  sinal: number;
  dataInicio: string; 
  numeroParcelas: number;
  aReceber: number;
  totalPago: number;
  totalCancelado: number;
  parcelas: Parcela[];
}

export interface Parcela {
  numero: number;
  valor: number;
  vencimento: string; 
  statusPagamento: EStatusPagamento;
}

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
}

export interface Parcela {
  numero: number
  valor: number
  vencimento: string
  statusPagamento: EStatusPagamento
}

export enum EStatusPagamento {
  Pendente = 1,
  Pago = 2,
  Cancelado = 3,
  Estornado = 4,
}

export type PedidosResponse = Pedido[]

export interface EstoqueTotalAgregado {
  total: number
  baixoEstoque: number
}