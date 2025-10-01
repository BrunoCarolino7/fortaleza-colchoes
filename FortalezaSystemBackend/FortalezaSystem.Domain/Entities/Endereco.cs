namespace FortalezaSystem.Domain.Entities;

public class Endereco : BaseEntity
{
    public string Logradouro { get; set; }
    public string Bairro { get; set; }
    public string Jardim { get; set; }
    public string CEP { get; set; }
    public string Localizacao { get; set; }
    public string Cidade { get; set; }
    public string Estado { get; set; }

    // FK
    public int? ClienteId { get; set; }
    public Clientes? Cliente { get; set; }
}
