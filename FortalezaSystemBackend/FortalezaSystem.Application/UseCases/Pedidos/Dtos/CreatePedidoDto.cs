namespace FortalezaSystem.Application.UseCases.Pedidos.Dtos;

public class CreatePedidoDto
{
    public int ClienteId { get; set; }
    public int InformacoesPagamentosId { get; set; }
    public int ParcelaId { get; set; }
}
