namespace FortalezaSystem.Application.UseCases.Estoque.Dtos;

public class EstoqueAllDto
{
    public IEnumerable<EstoqueItemDto> Data { get; set; } = [];
    public int Total { get; set; }
    public int BaixoEstoque { get; set; }
    public int EmEstoque { get; set; }
    public int SemEstoque { get; set; }
}
