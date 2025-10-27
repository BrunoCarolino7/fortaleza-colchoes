using FortalezaSystem.Infrastructure.Context;
using MediatR;
namespace FortalezaSystem.Application.UseCases.Pedidos.Commands.CreatePedido;

using PedidosEntity = FortalezaSystem.Domain.Entities.Pedidos;

public class CreatePedidoHandler : IRequestHandler<CreatePedidoCommand, int>
{
    private readonly DataContext _context;

    public CreatePedidoHandler(DataContext context)
    {
        _context = context;
    }

    public async Task<int> Handle(CreatePedidoCommand request, CancellationToken cancellationToken)
    {
        var dto = request.Pedido;

        var pedido = new PedidosEntity(dto.ClienteId, dto.InformacoesPagamentosId);

        _context.Pedidos.Add(pedido);
        await _context.SaveChangesAsync(cancellationToken);

        return pedido.Id;
    }
}
