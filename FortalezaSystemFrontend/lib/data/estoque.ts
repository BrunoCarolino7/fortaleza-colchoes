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

export const produtosIniciais: Produto[] = [
  {
    id: "1",
    nome: "Colchão Ortopédico Premium",
    categoria: "Ortopédico",
    tamanho: "Queen (158x198cm)",
    preco: 2499.9,
    quantidade: 45,
    estoqueMinimo: 10,
    fornecedor: "Ortobom",
    descricao: "Colchão ortopédico de alta densidade com molas ensacadas",
    dataCadastro: "2024-01-10",
  },
  {
    id: "2",
    nome: "Colchão Espuma D33",
    categoria: "Espuma",
    tamanho: "Casal (138x188cm)",
    preco: 899.9,
    quantidade: 8,
    estoqueMinimo: 15,
    fornecedor: "Castor",
    descricao: "Colchão de espuma D33 com tratamento anti-ácaro",
    dataCadastro: "2024-01-15",
  },
  {
    id: "3",
    nome: "Colchão Molas Pocket",
    categoria: "Molas",
    tamanho: "King (193x203cm)",
    preco: 3299.9,
    quantidade: 22,
    estoqueMinimo: 8,
    fornecedor: "Sealy",
    descricao: "Colchão com molas pocket individuais para maior conforto",
    dataCadastro: "2024-02-01",
  },
  {
    id: "4",
    nome: "Colchão Viscoelástico",
    categoria: "Viscoelástico",
    tamanho: "Solteiro (88x188cm)",
    preco: 1599.9,
    quantidade: 5,
    estoqueMinimo: 12,
    fornecedor: "Probel",
    descricao: "Colchão com camada de viscoelástico que se adapta ao corpo",
    dataCadastro: "2024-02-10",
  },
  {
    id: "5",
    nome: "Colchão Pillow Top",
    categoria: "Pillow Top",
    tamanho: "Queen (158x198cm)",
    preco: 2899.9,
    quantidade: 18,
    estoqueMinimo: 10,
    fornecedor: "Simmons",
    descricao: "Colchão com camada extra de conforto pillow top",
    dataCadastro: "2024-03-05",
  },
]
