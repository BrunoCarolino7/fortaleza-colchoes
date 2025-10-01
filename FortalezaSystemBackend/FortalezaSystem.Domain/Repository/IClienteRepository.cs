using FortalezaSystem.Domain.Entities;

namespace FortalezaSystem.Domain.Repository;

public interface IClienteRepository
{
    public Task<IEnumerable<Clientes>> ObterClientes();
}
