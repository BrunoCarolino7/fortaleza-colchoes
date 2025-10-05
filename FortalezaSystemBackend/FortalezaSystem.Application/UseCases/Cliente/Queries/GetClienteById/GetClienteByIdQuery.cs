using MediatR;

using ClienteEntiy = FortalezaSystem.Domain.Entities.Clientes;


namespace FortalezaSystem.Application.UseCases.Cliente.Queries.GetClienteById;

public record GetClienteByIdQuery(int Id) : IRequest<ClienteEntiy>;
