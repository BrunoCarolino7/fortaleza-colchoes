namespace FortalezaSystem.Domain.Entities;

public class Pedidos : BaseEntity
{
    public Pedidos(int clienteId, int informacoesPagamentoId)
    {
        ClienteId = clienteId;
        InformacoesPagamentoId = informacoesPagamentoId;
    }

    public int ClienteId { get; set; }
    public int InformacoesPagamentoId { get; set; }

    public Clientes? Cliente { get; set; }
    public InformacoesPagamento? InformacoesPagamento { get; set; }
}
