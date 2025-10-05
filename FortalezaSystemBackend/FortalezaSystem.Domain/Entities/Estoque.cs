using FortalezaSystem.Domain.Enuns;

namespace FortalezaSystem.Domain.Entities;

public class Estoque : BaseEntity
{
    private Estoque() { }

    private Estoque(string nome, string categoria, string tamanho, decimal preco, int quantidade, EStatusEstoque statusEstoque)
    {
        Nome = nome;
        Categoria = categoria;
        Tamanho = tamanho;
        Preco = preco;
        Quantidade = quantidade;
        StatusEstoque = statusEstoque;
    }

    public string Nome { get; private set; }
    public string Categoria { get; private set; }
    public string Tamanho { get; private set; }
    public decimal Preco { get; private set; }
    public int Quantidade { get; private set; }
    public EStatusEstoque StatusEstoque { get; private set; }

    public static Estoque Criar(string nome, string categoria, string tamanho, decimal preco, int quantidade)
    {
        if (string.IsNullOrWhiteSpace(nome))
            throw new ArgumentException("Nome do produto é obrigatório.");

        if (preco <= 0)
            throw new ArgumentException("Preço inválido.");

        if (quantidade < 0)
            throw new ArgumentException("Quantidade inválida.");

        var status = quantidade switch
        {
            > 10 => EStatusEstoque.EmEstoque,
            > 0 and <= 10 => EStatusEstoque.BaixoEstoque,
            0 => EStatusEstoque.SemEstoque,
            _ => throw new ArgumentOutOfRangeException(nameof(quantidade))
        };

        return new Estoque(nome, categoria, tamanho, preco, quantidade, status);
    }
}

