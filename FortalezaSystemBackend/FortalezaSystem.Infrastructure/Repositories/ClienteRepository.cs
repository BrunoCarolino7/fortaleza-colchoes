using FortalezaSystem.Domain.Entities;
using FortalezaSystem.Domain.Repository;
using FortalezaSystem.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace FortalezaSystem.Infrastructure.Repositories;

public class ClienteRepository(DataContext dataContext) : IClienteRepository
{
    private readonly DataContext _dataContext = dataContext;

    public async Task<IEnumerable<Clientes>> ObterClientes()
    {
        return await _dataContext.Clientes
        .AsNoTracking()
        //.Include(x=>x.)
        .ToListAsync();
    }
}
