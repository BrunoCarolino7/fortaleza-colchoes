namespace FortalezaSystem.Domain.Entities;

public class Conjuge : BaseEntity
{
    public string Nome { get; set; }
    public DateOnly? DataNascimento { get; set; }
    public string Naturalidade { get; set; }
    public string LocalDeTrabalho { get; set; }

    // FK
    public int ClienteId { get; set; }
    public Clientes Cliente { get; set; }

    public int DocumentoId { get; set; }
    public Documento Documento { get; set; }
}
