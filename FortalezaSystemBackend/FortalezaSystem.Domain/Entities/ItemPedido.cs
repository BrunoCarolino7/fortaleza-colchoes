namespace FortalezaSystem.Domain.Entities;

public class ItemPedido : BaseEntity
{
    public ItemPedido() { }

    public ItemPedido(int? pedidoId, int? produtoId, int quantidade, decimal precoUnitario)
    {
        PedidoId = pedidoId;
        ProdutoId = produtoId;
        Quantidade = quantidade;
        PrecoUnitario = precoUnitario;
    }
    public ItemPedido(int? id, int? pedidoId, int? produtoId, int quantidade, decimal precoUnitario)
    {
        Id = id;
        PedidoId = pedidoId;
        ProdutoId = produtoId;
        Quantidade = quantidade;
        PrecoUnitario = precoUnitario;
    }


    public int? PedidoId { get; set; }
    public Pedidos Pedido { get; set; } = null!;

    public int? ProdutoId { get; set; }
    public Estoque Produto { get; set; } = null!;

    public int Quantidade { get; set; }
    public decimal PrecoUnitario { get; set; }

    public InformacoesPagamento InformacoesPagamento { get; set; } = null!;
}
