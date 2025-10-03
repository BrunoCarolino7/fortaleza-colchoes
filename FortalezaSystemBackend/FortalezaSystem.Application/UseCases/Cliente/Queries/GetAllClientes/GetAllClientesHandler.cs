using FortalezaSystem.Domain.Repository;
using MediatR;

namespace FortalezaSystem.Application.UseCases.Cliente.Queries.GetAllClientes;

public class GetAllClientesHandler(IClienteRepository clienteRepository) : IRequestHandler<GetAllClientesQuery, IEnumerable<ClienteDto>>
{
    private readonly IClienteRepository _clienteRepository = clienteRepository;

    public async Task<IEnumerable<ClienteDto>> Handle(GetAllClientesQuery request, CancellationToken cancellationToken)
    {
        return await _clienteRepository.ObterClientes(cancellationToken);
    }
}
