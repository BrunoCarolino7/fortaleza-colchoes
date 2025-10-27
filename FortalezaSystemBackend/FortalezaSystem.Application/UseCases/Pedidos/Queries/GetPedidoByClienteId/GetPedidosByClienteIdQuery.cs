using FortalezaSystem.Application.UseCases.Pedidos.Dtos;
using MediatR;

namespace FortalezaSystem.Application.UseCases.Pedidos.Queries.GetPedidoByClienteId;

public record GetPedidosByClienteIdQuery(int ClienteId) : IRequest<IEnumerable<PedidosAllDto>>;
