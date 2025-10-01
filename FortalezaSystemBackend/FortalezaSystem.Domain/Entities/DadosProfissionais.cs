namespace FortalezaSystem.Domain.Entities;

public class DadosProfissionais : BaseEntity
{
    public string EmpregoAnterior { get; set; }
    public string Empresa { get; set; }
    public string Telefone { get; set; }
    public decimal Salario { get; set; }

    // FK
    public int ClienteId { get; set; }
    public Clientes Cliente { get; set; }

    // Endereço da empresa separado
    public int? EnderecoEmpresaId { get; set; }
    public Endereco EnderecoEmpresa { get; set; }
}
