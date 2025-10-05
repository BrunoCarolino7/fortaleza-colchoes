using FortalezaSystem.Application.UseCases.Estoque.Dtos;
using FortalezaSystem.Domain.Repository;
using MediatR;

namespace FortalezaSystem.Application.UseCases.Estoque.Queries.GetAllEstoques;

public class GetAllEstoqueHandler : IRequestHandler<GetAllEstoqueQuery, EstoqueAllDto>
{
    private readonly IEstoqueRepository _estoqueRepository;

    public GetAllEstoqueHandler(IEstoqueRepository estoqueRepository)
    {
        _estoqueRepository = estoqueRepository;
    }

    public async Task<EstoqueAllDto> Handle(GetAllEstoqueQuery request, CancellationToken cancellationToken)
    {
        var (data, totalItems) = await _estoqueRepository.ObterEstoqueTotal(request.Page, request.PageSize);

        var dtoList = data.Select(e => new EstoqueItemDto
        {
            Id = e.Id,
            Nome = e.Nome,
            Categoria = e.Categoria,
            Tamanho = e.Tamanho,
            Preco = e.Preco,
            Quantidade = e.Quantidade
        }).ToList();

        var baixo = dtoList.Count(x => x.Quantidade <= 10 && x.Quantidade > 0);
        var sem = dtoList.Count(x => x.Quantidade == 0);
        var emEstoque = dtoList.Count(x => x.Quantidade > 10);

        return new EstoqueAllDto
        {
            Data = dtoList,
            Total = totalItems,
            BaixoEstoque = baixo,
            SemEstoque = sem,
            EmEstoque = emEstoque
        };
    }
}
