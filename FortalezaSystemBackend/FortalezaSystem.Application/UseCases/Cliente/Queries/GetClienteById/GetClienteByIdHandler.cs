using FortalezaSystem.Domain.Repository;
using MediatR;

namespace FortalezaSystem.Application.UseCases.Cliente.Queries.GetClienteById;

public class GetClienteByIdHandler(IClienteRepository clienteRepository) : IRequestHandler<GetClienteByIdQuery, ClienteDto?>
{
    private readonly IClienteRepository _clienteRepository = clienteRepository;

    public async Task<ClienteDto?> Handle(GetClienteByIdQuery request, CancellationToken cancellationToken)
    {
        return await _clienteRepository.ObterCliente(request.Id, cancellationToken);
    }
}