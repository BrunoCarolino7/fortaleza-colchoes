using FortalezaSystem.Infrastructure.Context;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace FortalezaSystem.Application.UseCases.Cliente.Queries.GetNumberCustomers;

public class GetNumberCustomersHandler(DataContext context) : IRequestHandler<GetNumberCustomersQuery, int>
{
    private readonly DataContext _context = context;

    public async Task<int> Handle(GetNumberCustomersQuery request, CancellationToken cancellationToken)
    {
        return await _context.Clientes.Where(x => x.Status).CountAsync(cancellationToken);
    }
}
