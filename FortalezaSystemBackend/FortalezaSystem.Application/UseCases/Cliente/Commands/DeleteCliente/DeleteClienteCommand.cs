using MediatR;

namespace FortalezaSystem.Application.UseCases.Cliente.Commands.DeleteCliente;

public record DeleteClienteCommand(int Id) : IRequest<bool>;
