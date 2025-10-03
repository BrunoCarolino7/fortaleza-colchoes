using FortalezaSystem.Domain.Entities;

namespace FortalezaSystem.Domain.Repository;

public interface IFortalezaUserRepository
{
    public Task<FortalezaUser> ObterUsuario(string user, string password);
}
