using FortalezaSystem.Domain.Enuns;

namespace FortalezaSystem.Application.UseCases.Estoque.Dtos;

public class EstoqueItemDto
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Categoria { get; set; } = string.Empty;
    public string Tamanho { get; set; } = string.Empty;
    public decimal Preco { get; set; }
    public int Quantidade { get; set; }
    public EStatusEstoque StatusEstoque { get; set; }

    public static EstoqueItemDto ConvertToDto(FortalezaSystem.Domain.Entities.Estoque estoque)
    {
        return new EstoqueItemDto
        {
            Id = estoque.Id,
            Nome = estoque.Nome,
            Categoria = estoque.Categoria,
            Tamanho = estoque.Tamanho,
            Preco = estoque.Preco,
            Quantidade = estoque.Quantidade,
            StatusEstoque = estoque.StatusEstoque
        };
    }
}
