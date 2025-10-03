namespace FortalezaSystem.Domain.Repository;

public interface IClienteRepository
{
    public Task<IEnumerable<ClienteDto>> ObterClientes(CancellationToken cancellationToken);
    public Task<ClienteDto> ObterCliente(int id, CancellationToken cancellationToken);
}
