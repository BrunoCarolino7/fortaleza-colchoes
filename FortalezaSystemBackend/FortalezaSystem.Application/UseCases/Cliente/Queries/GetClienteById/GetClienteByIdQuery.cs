using MediatR;

namespace FortalezaSystem.Application.UseCases.Cliente.Queries.GetClienteById;

public record GetClienteByIdQuery(int Id) : IRequest<ClienteDto>;
