namespace FortalezaSystem.Domain.Entities;

public class Assinatura : BaseEntity
{
    public string AssinaturaCliente { get; set; }

    // FK
    public int ClienteId { get; set; }
    public Clientes Cliente { get; set; }
}
