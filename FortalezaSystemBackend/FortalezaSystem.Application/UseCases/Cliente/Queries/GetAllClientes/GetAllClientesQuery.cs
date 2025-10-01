using FortalezaSystem.Domain.Dtos;
using MediatR;

namespace FortalezaSystem.Application.UseCases.Cliente.Queries.GetAllClientes;

public record GetAllClientesQuery() : IRequest<IEnumerable<ClienteDto>>;
