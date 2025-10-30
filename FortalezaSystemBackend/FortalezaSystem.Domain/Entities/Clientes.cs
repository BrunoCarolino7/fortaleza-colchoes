using FortalezaSystem.Domain.SeedWork;

namespace FortalezaSystem.Domain.Entities;

public class Clientes : AggregateRoot
{
    public Clientes() { }

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
        ICollection<Endereco>? enderecos,
        List<Pedidos>? pedidos)
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
        Enderecos = enderecos ?? [];
        Pedidos = pedidos ?? [];
        Status = true;
    }

    public string? Nome { get; private set; }
    public string? Filiacao { get; private set; }
    public DateOnly? DataNascimento { get; private set; }
    public string? EstadoCivil { get; private set; }
    public string? Nacionalidade { get; private set; }
    public string? Naturalidade { get; private set; }
    public string? Email { get; private set; }
    public string? Telefone { get; private set; }
    public ICollection<Endereco>? Enderecos { get; set; }
    public Documento? Documento { get; set; }
    public DadosProfissionais? DadosProfissionais { get; set; }
    public Conjuge? Conjuge { get; set; }
    public FortalezaUser? FortalezaUser { get; set; }
    public List<Pedidos>? Pedidos { get; set; }

    public void AtualizarDados(string nome, string cpf, string rg)
    {
        if (string.IsNullOrWhiteSpace(nome)) throw new ArgumentException("Nome obrigatório.");
        if (string.IsNullOrWhiteSpace(cpf)) throw new ArgumentException("CPF obrigatório.");
        if (string.IsNullOrWhiteSpace(rg)) throw new ArgumentException("RG obrigatório.");
        if (Documento is null) throw new ArgumentException("Documento não encontrado.");

        Nome = nome;
        Documento.CPF = cpf;
        Documento.RG = rg;
    }

    public void AtualizarDados(
        string? nome, string? filiacao, string? nacionalidade, string? naturalidade,
        string? estadoCivil, DateOnly? dataNascimento, string? email, string? telefone,
        string? cpf, string? rg)
    {
        if (nome is not null) Nome = nome;
        if (filiacao is not null) Filiacao = filiacao;
        if (nacionalidade is not null) Nacionalidade = nacionalidade;
        if (naturalidade is not null) Naturalidade = naturalidade;
        if (estadoCivil is not null) EstadoCivil = estadoCivil;
        if (dataNascimento is not null) DataNascimento = dataNascimento;
        if (email is not null) Email = email;
        if (telefone is not null) Telefone = telefone;
        if (cpf is not null && Documento is not null) Documento.CPF = cpf;
        if (telefone is not null && Documento is not null) Documento.RG = rg;
    }
}
