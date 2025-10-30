using FortalezaSystem.Application.UseCases.Cliente.Dtos;

namespace FortalezaSystem.Application.UseCases.Pedidos.Dtos;

public class PedidosAllDto
{
    public int? Id { get; set; }
    public int? ClienteId { get; set; }
    public ICollection<ItemPedidoDto>? Itens { get; set; }
}
