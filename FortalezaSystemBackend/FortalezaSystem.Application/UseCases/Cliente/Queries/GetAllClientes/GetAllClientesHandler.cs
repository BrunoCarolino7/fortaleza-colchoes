using FortalezaSystem.Application.UseCases.Cliente.Dtos;
using FortalezaSystem.Application.UseCases.Cliente.Queries.GetAllClientes;
using FortalezaSystem.Domain;
using FortalezaSystem.Domain.Repository;
using MediatR;

public class GetAllClientesHandler : IRequestHandler<GetAllClientesQuery, PagedResult<ClienteDto>>
{
    private readonly IClienteRepository _clienteRepository;

    public GetAllClientesHandler(IClienteRepository clienteRepository)
    {
        _clienteRepository = clienteRepository;
    }

    public async Task<PagedResult<ClienteDto>> Handle(GetAllClientesQuery request, CancellationToken cancellationToken)
    {
        var pagedClientes = await _clienteRepository.ObterClientes(request.Page, request.PageSize, cancellationToken);

        var dtoList = pagedClientes.Data.Select(ClienteDto.ConvertToDto).ToList();

        return new PagedResult<ClienteDto>
        {
            Data = dtoList,
            TotalItems = pagedClientes.TotalItems,
            Page = pagedClientes.Page,
            PageSize = pagedClientes.PageSize
        };
    }
}
