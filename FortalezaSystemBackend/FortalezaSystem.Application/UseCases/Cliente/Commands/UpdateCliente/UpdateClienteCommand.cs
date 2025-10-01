using MediatR;

namespace FortalezaSystem.Application.UseCases.Cliente.Commands.UpdateCliente;

public record UpdateClienteCommand(int Id, string Nome, string CPF, string RG) : IRequest<bool>;
