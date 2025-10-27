using FortalezaSystem.Domain.SeedWork;

namespace FortalezaSystem.Domain.Entities;

public class Clientes : AggregateRoot
{

    private Clientes() { }

    public Clientes(
    string? nome,
    string? filiacao,
    DateOnly? dataNascimento,
    string? estadoCivil,
    string? nacionalidade,
    string? naturalidade,
    string? telefone,
    string? email,
    Documento? documento,
    DadosProfissionais? dadosProfissionais,
    Conjuge? conjuge,
    InformacoesPagamento? pagamento,
    ICollection<Endereco>? enderecos,
    List<Estoque> estoque)
    {
        Nome = nome;
        Filiacao = filiacao;
        DataNascimento = dataNascimento;
        EstadoCivil = estadoCivil;
        Nacionalidade = nacionalidade;
        Naturalidade = naturalidade;
        Email = email;
        Telefone = telefone;
        Documento = documento;
        DadosProfissionais = dadosProfissionais;
        Conjuge = conjuge;
        Pagamento = pagamento;
        Enderecos = enderecos ?? [];
        Estoque = estoque;
        Status = true;
    }

    public string? Nome { get; private set; } = default!;
    public string? Filiacao { get; private set; } = default!;
    public DateOnly? DataNascimento { get; private set; }
    public string? EstadoCivil { get; private set; } = default!;
    public string? Nacionalidade { get; private set; } = default!;
    public string? Naturalidade { get; private set; } = default!;
    public string? Email { get; private set; } = default!;
    public string? Telefone { get; private set; } = default!;
    public bool? Status { get; private set; } = default!;
    public ICollection<Endereco>? Enderecos { get; private set; } = [];
    public Documento? Documento { get; private set; }
    public DadosProfissionais? DadosProfissionais { get; set; }
    public Conjuge? Conjuge { get; set; }
    public InformacoesPagamento? Pagamento { get; set; }
    public List<Estoque>? Estoque { get; private set; }
    public FortalezaUser? FortalezaUser { get; private set; }
    public List<Pedidos>? Pedidos { get; private set; }

    public void AtualizarDados(string nome, string cpf, string rg)
    {
        if (string.IsNullOrWhiteSpace(nome))
            throw new ArgumentException("O nome não pode ser vazio.");
        if (string.IsNullOrWhiteSpace(cpf))
            throw new ArgumentException("O CPF não pode ser vazio.");
        if (string.IsNullOrWhiteSpace(rg))
            throw new ArgumentException("O RG não pode ser vazio.");
        if (Documento is null)
            throw new ArgumentException("Não há documento registrado para essa pessoa.");

        Nome = nome;
        Documento.CPF = cpf;
        Documento.RG = rg;
    }

    public void AtualizarDados(string? nome, string? filiacao, string? nacionalidade, string? naturalidade,
    string? estadoCivil, DateOnly? dataNascimento, string? email, string? telefone)
    {
        if (nome is not null)
            Nome = nome;
        if (filiacao is not null)
            Filiacao = filiacao;

        if (nacionalidade is not null)
            Nacionalidade = nacionalidade;
        if (naturalidade is not null)
            Naturalidade = naturalidade;
        if (estadoCivil is not null)
            EstadoCivil = estadoCivil;
        if (dataNascimento is not null)
            DataNascimento = dataNascimento;
        if (email is not null)
            Email = email;
        if (telefone is not null)
            Telefone = telefone;
    }
}
