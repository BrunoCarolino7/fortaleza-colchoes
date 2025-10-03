using FortalezaSystem.Domain.Entities;
using FortalezaSystem.Domain.Repository;
using FortalezaSystem.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace FortalezaSystem.Infrastructure.Repositories;

public class FortalezaUserRepository(DataContext dataContext) : IFortalezaUserRepository
{
    private readonly DataContext _dataContext = dataContext;

    public async Task<FortalezaUser> ObterUsuario(string user, string password)
    {
        return (await _dataContext.FortalezaUser
            .Include(x => x.Cliente)
            .FirstOrDefaultAsync(x => x.Usuario == user && x.SenhaHash == password))!;
    }
}
