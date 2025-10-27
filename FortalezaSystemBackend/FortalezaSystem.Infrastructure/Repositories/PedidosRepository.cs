using FortalezaSystem.Domain.Entities;
using FortalezaSystem.Domain.Repository;
using FortalezaSystem.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace FortalezaSystem.Infrastructure.Repositories;

public class PedidosRepository(DataContext dataContext) : IPedidosRepository
{
    private readonly DataContext _dataContext = dataContext;

    public async Task<IEnumerable<Pedidos>> GetAll()
    {
        return await _dataContext.Pedidos
            .AsNoTracking()
            .ToListAsync();
    }
}
