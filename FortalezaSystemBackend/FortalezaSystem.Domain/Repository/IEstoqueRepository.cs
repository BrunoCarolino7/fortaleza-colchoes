using FortalezaSystem.Domain.Entities;

namespace FortalezaSystem.Domain.Repository;

public interface IEstoqueRepository
{
    Task<Estoque> CriarEstoque(Estoque estoque);
    Task<(IEnumerable<Estoque> Data, int TotalItems)> ObterEstoqueTotal(int page, int pageSize);
    Task<Estoque> ObterEstoquePorId(int produtoId);
    Task<bool> DeletarPorId(int produtoId);
    Task AtualizarEstoquePorId(int produtoId);
}
