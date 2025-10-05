using FortalezaSystem.Domain.Repository;
using MediatR;

using ClienteEntiy = FortalezaSystem.Domain.Entities.Clientes;

namespace FortalezaSystem.Application.UseCases.Cliente.Queries.GetClienteById;

public class GetClienteByIdHandler(IClienteRepository clienteRepository) : IRequestHandler<GetClienteByIdQuery, ClienteEntiy>
{
    private readonly IClienteRepository _clienteRepository = clienteRepository;

    public async Task<ClienteEntiy> Handle(GetClienteByIdQuery request, CancellationToken cancellationToken)
    {
        return await _clienteRepository.ObterCliente(request.Id, cancellationToken);
    }
}