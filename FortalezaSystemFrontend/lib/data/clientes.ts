export interface Endereco {
  id?: string
  logradouro: string
  bairro: string
  jardim: string
  cep: string
  localizacao: string
  cidade: string
  estado: string
}

export interface DadosProfissionais {
  id?: string
  empresa: string
  empregoAnterior: string
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
  statusPagamento: number // 0 = pendente, 1 = pago
}

export interface Pagamento {
  id?: string
  valorTotal: number
  sinal: number
  dataInicio: string
  numeroParcelas: number
  parcelas: Parcela[]
}

export interface Cliente {
  id: string
  nome: string
  filiacao: string
  nacionalidade: string
  naturalidade: string
  estadoCivil: string
  dataNascimento: string
  cpf: string
  rg: string
  enderecos: Endereco[]
  dadosProfissionais?: DadosProfissionais
  conjuge?: Conjuge
  referencias: Referencia[]
  assinatura: string
  pagamento?: Pagamento
  dataCadastro: string
}

export const clientesIniciais: Cliente[] = [
  {
    id: "1",
    nome: "João da Silva",
    filiacao: "Maria Oliveira e Carlos Silva",
    nacionalidade: "Brasileiro",
    naturalidade: "São Paulo - SP",
    estadoCivil: "Casado",
    dataNascimento: "1990-05-15",
    cpf: "12345678901",
    rg: "112223334",
    enderecos: [
      {
        id: "1",
        logradouro: "Rua das Flores, 123",
        bairro: "Centro",
        jardim: "Jardim Primavera",
        cep: "01001-000",
        localizacao: "Apartamento 45, Bloco B",
        cidade: "São Paulo",
        estado: "SP",
      },
    ],
    dadosProfissionais: {
      empresa: "Tech Solutions Ltda",
      empregoAnterior: "InovaTI Serviços",
      telefone: "(11) 99876-5432",
      salario: 5500.75,
      enderecoEmpresa: {
        logradouro: "Avenida Paulista, 1000",
        bairro: "Bela Vista",
        jardim: "Jardim Paulista",
        cep: "01310-100",
        localizacao: "10º andar, sala 1005",
        cidade: "São Paulo",
        estado: "SP",
      },
    },
    conjuge: {
      nome: "Ana Souza",
      dataNascimento: "1992-09-10",
      naturalidade: "Campinas - SP",
      localDeTrabalho: "Hospital São Lucas",
      cpf: "98765432100",
      rg: "556677889",
    },
    referencias: [
      {
        id: "1",
        nome: "Carlos Mendes",
        endereco: {
          logradouro: "Rua das Acácias, 45",
          bairro: "Vila Mariana",
          jardim: "Jardim das Acácias",
          cep: "04101-200",
          localizacao: "Casa 2",
          cidade: "São Paulo",
          estado: "SP",
        },
      },
    ],
    assinatura: "João da Silva",
    pagamento: {
      valorTotal: 12000,
      sinal: 2000,
      dataInicio: "2025-10-05",
      numeroParcelas: 10,
      parcelas: [
        {
          numero: 1,
          valor: 1000,
          vencimento: "2025-11-05",
          statusPagamento: 1,
        },
        {
          numero: 2,
          valor: 1000,
          vencimento: "2025-12-05",
          statusPagamento: 0,
        },
      ],
    },
    dataCadastro: "2024-01-15",
  },
  {
    id: "2",
    nome: "Maria Santos",
    filiacao: "José Santos e Ana Santos",
    nacionalidade: "Brasileira",
    naturalidade: "Rio de Janeiro - RJ",
    estadoCivil: "Solteira",
    dataNascimento: "1985-08-20",
    cpf: "98765432100",
    rg: "998877665",
    enderecos: [
      {
        id: "2",
        logradouro: "Av. Paulista, 1000",
        bairro: "Bela Vista",
        jardim: "Jardim Paulista",
        cep: "01310-100",
        localizacao: "Cobertura 1",
        cidade: "São Paulo",
        estado: "SP",
      },
    ],
    dadosProfissionais: {
      empresa: "Consultoria ABC",
      empregoAnterior: "Empresa XYZ",
      telefone: "(11) 91234-5678",
      salario: 8500.0,
      enderecoEmpresa: {
        logradouro: "Rua Augusta, 500",
        bairro: "Consolação",
        jardim: "Jardim Augusta",
        cep: "01305-000",
        localizacao: "5º andar",
        cidade: "São Paulo",
        estado: "SP",
      },
    },
    referencias: [],
    assinatura: "Maria Santos",
    dataCadastro: "2024-02-20",
  },
]
