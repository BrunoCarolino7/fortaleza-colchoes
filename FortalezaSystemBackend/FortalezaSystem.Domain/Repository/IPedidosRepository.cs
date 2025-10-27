using FortalezaSystem.Domain.Entities;

namespace FortalezaSystem.Domain.Repository;

public interface IPedidosRepository
{
    Task<IEnumerable<Pedidos>> GetAll();
}
