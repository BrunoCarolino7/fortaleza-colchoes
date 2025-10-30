using FortalezaSystem.Application.UseCases.Cliente.Dtos;
using MediatR;

namespace FortalezaSystem.Application.UseCases.Pedidos.Commands.CreatePedido;

public record CreatePedidoCommand(PedidoDto Pedido) : IRequest<int?>;
