namespace FortalezaSystem.Domain.Entities;

public class DadosProfissionais : BaseEntity
{
    private DadosProfissionais() { }
    public DadosProfissionais(string empresa, string empregoAnterior, string telefone, decimal salario, Endereco endereco)
    {
        Empresa = empresa;
        EmpregoAnterior = empregoAnterior;
        Telefone = telefone;
        Salario = salario;
        EnderecoEmpresa = endereco;
    }

    public string EmpregoAnterior { get; set; }
    public string Empresa { get; set; }
    public string Telefone { get; set; }
    public decimal Salario { get; set; }

    public int ClienteId { get; set; }
    public Clientes Cliente { get; set; }

    public int? EnderecoEmpresaId { get; set; }
    public Endereco EnderecoEmpresa { get; set; }
}
