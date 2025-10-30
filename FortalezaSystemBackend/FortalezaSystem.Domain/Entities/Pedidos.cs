namespace FortalezaSystem.Domain.Entities;

public class Pedidos : BaseEntity
{
    public Pedidos() { }

    public Pedidos(int? clienteId, List<ItemPedido> itens)
    {
        ClienteId = clienteId;
        Itens = itens;
    }
    public int? ClienteId { get; set; }
    public Clientes Cliente { get; set; } = null!;
    public ICollection<ItemPedido> Itens { get; set; } = [];

}
