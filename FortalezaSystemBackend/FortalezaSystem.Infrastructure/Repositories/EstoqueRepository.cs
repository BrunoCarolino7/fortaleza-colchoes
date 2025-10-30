using FortalezaSystem.Domain.Entities;
using FortalezaSystem.Domain.Repository;
using FortalezaSystem.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace FortalezaSystem.Infrastructure.Repositories;

public class EstoqueRepository(DataContext dataContext) : IEstoqueRepository
{
    private readonly DataContext _dataContext = dataContext;

    public async Task<Estoque> ObterEstoquePorId(int produtoId)
    {
        var item = await _dataContext.Estoque
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == produtoId);

        if (item == null)
            return null!;
        return item;
    }
    public async Task<IEnumerable<Estoque>> ObterEstoqueTotalPaginado()
    {
        return await _dataContext
            .Estoque
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<(IEnumerable<Estoque> Data, int TotalItems)> ObterEstoqueTotal(int page, int pageSize)
    {
        if (page <= 0) page = 1;
        if (pageSize <= 0) pageSize = 10;

        var query = _dataContext.Estoque.Where(x => x.Status).AsNoTracking();

        var totalItems = await query.CountAsync();

        var data = await query
            .OrderBy(e => e.Nome)
            .Where(x => x.Status)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (data, totalItems);
    }


    public async Task AtualizarEstoquePorId(int produtoId)
    {
        var item = await ObterEstoquePorId(produtoId);

        if (item == null)
            return;
        _dataContext.Estoque.Update(item);
        await _dataContext.SaveChangesAsync();
    }

    public async Task<bool> DeletarPorId(int produtoId)
    {
        var item = await ObterEstoquePorId(produtoId);

        if (item == null)
            return false;

        _dataContext.Estoque.Update(item);
        await _dataContext.SaveChangesAsync();
        return true;
    }

    public async Task<Estoque> CriarEstoque(Estoque estoque)
    {
        await _dataContext.AddAsync(estoque);
        await _dataContext.SaveChangesAsync();

        return estoque;
    }
}
