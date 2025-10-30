using FortalezaSystem.Application.UseCases.Estoque.Dtos;
using FortalezaSystem.Domain.Enuns;
using FortalezaSystem.Domain.Repository;
using FortalezaSystem.Infrastructure.Context;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace FortalezaSystem.Application.UseCases.Estoque.Queries.GetAllEstoques;

public class GetAllEstoqueHandler : IRequestHandler<GetAllEstoqueQuery, EstoqueAllDto>
{
    private readonly IEstoqueRepository _estoqueRepository;
    private readonly DataContext _dataContext;

    public GetAllEstoqueHandler(IEstoqueRepository estoqueRepository, DataContext dataContext)
    {
        _estoqueRepository = estoqueRepository;
        _dataContext = dataContext;
    }

    public async Task<EstoqueAllDto> Handle(GetAllEstoqueQuery request, CancellationToken cancellationToken)
    {
        var page = request.Page <= 0 ? 1 : request.Page;
        var pageSize = request.PageSize <= 0 ? 10 : request.PageSize;

        var (data, totalItems) = await _estoqueRepository.ObterEstoqueTotal(page, pageSize);

        var query = _dataContext.Estoque.AsNoTracking();

        var baixo = await query.CountAsync(x => x.StatusEstoque == EStatusEstoque.BaixoEstoque);
        var sem = await query.CountAsync(x => x.StatusEstoque == EStatusEstoque.SemEstoque);
        var emEstoque = await query.CountAsync(x => x.StatusEstoque == EStatusEstoque.EmEstoque);

        var dtoList = data.Select(e => new EstoqueItemDto
        {
            Id = e.Id,
            Nome = e.Nome,
            Categoria = e.Categoria,
            Tamanho = e.Tamanho,
            Preco = e.Preco,
            Quantidade = e.Quantidade,
            StatusEstoque = e.StatusEstoque
        }).ToList();

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
