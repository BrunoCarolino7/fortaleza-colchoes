namespace FortalezaSystem.Domain.Repository;

using FortalezaSystem.Domain;
using ClienteEntity = Entities.Clientes;

public interface IClienteRepository
{
    public Task<PagedResult<ClienteEntity>> ObterClientes(int page, int pageSize, CancellationToken cancellationToken);
    public Task<ClienteEntity> ObterCliente(int id, CancellationToken cancellationToken);
}
