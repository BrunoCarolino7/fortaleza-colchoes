using MediatR;

namespace FortalezaSystem.Application.UseCases.Cliente.Commands.DeleteCliente;

public record DeleteClienteCommand(Guid Id) : IRequest<bool>;
