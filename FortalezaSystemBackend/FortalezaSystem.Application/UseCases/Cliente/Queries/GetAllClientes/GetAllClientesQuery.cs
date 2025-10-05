using FortalezaSystem.Application.UseCases.Cliente.Dtos;
using FortalezaSystem.Domain;
using MediatR;

namespace FortalezaSystem.Application.UseCases.Cliente.Queries.GetAllClientes;

public record GetAllClientesQuery : IRequest<PagedResult<ClienteDto>>
{
    public GetAllClientesQuery() { }

    public GetAllClientesQuery(int page, int pageSize)
    {
        Page = page;
        PageSize = pageSize;
    }

    public int Page { get; set; }
    public int PageSize { get; set; }
}
