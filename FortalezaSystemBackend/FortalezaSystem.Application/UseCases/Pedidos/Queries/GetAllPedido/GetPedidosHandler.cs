using FortalezaSystem.Application.UseCases.Pedidos.Dtos;
using FortalezaSystem.Infrastructure.Context;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace FortalezaSystem.Application.UseCases.Pedidos.Queries.GetAllPedido;

public class GetPedidosHandler : IRequestHandler<GetPedidosQuery, IEnumerable<PedidosAllDto>>
{
    private readonly DataContext _context;

    public GetPedidosHandler(DataContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<PedidosAllDto>> Handle(GetPedidosQuery request, CancellationToken cancellationToken)
    {
        var pedidos = await _context.Pedidos
            .Include(p => p.Cliente)
            .Include(p => p.InformacoesPagamento)
            .ThenInclude(p => p.Parcelas)
            .Select(p => new PedidosAllDto
            {
                Id = p.Id,
                ClienteId = p.ClienteId
            })
            .AsNoTracking()
            .ToListAsync(cancellationToken);

        return pedidos;
    }
}
