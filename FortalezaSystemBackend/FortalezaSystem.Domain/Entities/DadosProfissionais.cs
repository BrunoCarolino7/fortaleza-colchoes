namespace FortalezaSystem.Domain.Entities;

public class DadosProfissionais : BaseEntity
{
    public DadosProfissionais() { }
    public DadosProfissionais(string? empresa, string? telefone, decimal? salario, Endereco? endereco, string? profissao)
    {
        Empresa = empresa;
        Telefone = telefone;
        Salario = salario;
        EnderecoEmpresa = endereco;
        Profissao = profissao;
    }

    public string? Empresa { get; set; }
    public string? Profissao { get; set; }
    public string? Telefone { get; set; }
    public decimal? Salario { get; set; }

    public int? ClienteId { get; set; }
    public Clientes? Cliente { get; set; }

    public int? EnderecoEmpresaId { get; set; }
    public Endereco? EnderecoEmpresa { get; set; }

    public void Atualizar(
    string? empresa,
    string? telefone,
    decimal? salario,
    string? profissao)
    {
        if (empresa is not null) Empresa = empresa;
        if (telefone is not null) Telefone = telefone;
        if (salario is not null) Salario = salario;
        if (profissao is not null) Profissao = profissao;
    }

}
