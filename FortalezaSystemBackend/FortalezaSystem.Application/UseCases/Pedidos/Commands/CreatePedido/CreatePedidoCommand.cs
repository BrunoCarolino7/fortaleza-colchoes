using FortalezaSystem.Application.UseCases.Pedidos.Dtos;
using MediatR;

namespace FortalezaSystem.Application.UseCases.Pedidos.Commands.CreatePedido;

public record CreatePedidoCommand(CreatePedidoDto Pedido) : IRequest<int>;

