namespace FortalezaSystem.Domain.Entities;

public class Documento : BaseEntity
{
    public string RG { get; set; }
    public string CPF { get; set; }

    public int? ClienteId { get; set; }
    public Clientes Cliente { get; set; }
}
