using MediatR;

namespace FortalezaSystem.Application.UseCases.Cliente.Queries.GetNumberCustomers;

public record GetNumberCustomersQuery() : IRequest<int>;
