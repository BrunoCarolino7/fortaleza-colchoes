namespace FortalezaSystem.Domain.Entities;

public class Conjuge : BaseEntity
{
    public Conjuge()
    {

    }
    public Conjuge(string nome, DateOnly? dataNascimento, string naturalidade, string localDeTrabalho, Documento? documento)
    {
        Nome = nome;
        DataNascimento = dataNascimento;
        Naturalidade = naturalidade;
        LocalDeTrabalho = localDeTrabalho;
        Documento = documento;
    }

    public string? Nome { get; set; }
    public DateOnly? DataNascimento { get; set; }
    public string? Naturalidade { get; set; }
    public string? LocalDeTrabalho { get; set; }

    public int? ClienteId { get; set; }
    public Clientes? Cliente { get; set; }

    public int? DocumentoId { get; set; }
    public Documento? Documento { get; set; }

    public void Atualizar(
    string? nome,
    DateOnly? dataNascimento,
    string? naturalidade,
    string? localDeTrabalho,
    string? cpf,
    string? rg)
    {
        if (nome is not null) Nome = nome;
        if (dataNascimento is not null) DataNascimento = dataNascimento;
        if (naturalidade is not null) Naturalidade = naturalidade;
        if (localDeTrabalho is not null) LocalDeTrabalho = localDeTrabalho;
        if (cpf is not null && Documento is not null) Documento.CPF = cpf;
        if (rg is not null && Documento is not null) Documento.RG = rg;
    }
}
