using FortalezaSystem.Application.UseCases.Estoque.Dtos;
using MediatR;

namespace FortalezaSystem.Application.UseCases.Estoque.Queries.GetAllEstoques;

public class GetAllEstoqueQuery : IRequest<EstoqueAllDto>
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}
