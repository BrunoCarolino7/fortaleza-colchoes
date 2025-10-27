using FortalezaSystem.Application.UseCases.Pedidos.Dtos;
using MediatR;

namespace FortalezaSystem.Application.UseCases.Pedidos.Queries.GetAllPedido;

public record GetPedidosQuery : IRequest<IEnumerable<PedidosAllDto>>;