namespace FortalezaSystem.Domain.Entities;

public class Referencia : BaseEntity
{
    public string Nome { get; set; }

    // FK
    public int ClienteId { get; set; }
    public Clientes Cliente { get; set; }

    public int EnderecoId { get; set; }
    public Endereco Endereco { get; set; }
}
