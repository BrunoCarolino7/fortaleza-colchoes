namespace FortalezaSystem.Domain.Entities;

public class Assinatura : BaseEntity
{
    private Assinatura()
    {

    }
    public Assinatura(string assinaturaCliente)
    {
        AssinaturaCliente = assinaturaCliente;
    }

    public string AssinaturaCliente { get; set; }

    // FK
    public int ClienteId { get; set; }
    public Clientes Cliente { get; set; }
}
