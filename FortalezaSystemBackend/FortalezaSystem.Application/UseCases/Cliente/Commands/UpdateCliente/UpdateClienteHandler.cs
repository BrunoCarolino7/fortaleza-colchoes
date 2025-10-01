using FortalezaSystem.Application.UseCases.Cliente.Commands.UpdateCliente;
using FortalezaSystem.Infrastructure.Context;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace FortalezaSystem.Application.Clientes.Commands.UpdateCliente;

public class UpdateClienteHandler(DataContext context) : IRequestHandler<UpdateClienteCommand, bool>
{
    private readonly DataContext _context = context;

    public async Task<bool> Handle(UpdateClienteCommand request, CancellationToken cancellationToken)
    {
        var cliente = await _context.Clientes
            .Include(c => c.Documento)
            .FirstOrDefaultAsync(c => c.Id == request.Id, cancellationToken);

        if (cliente == null) return false;

        cliente.Nome = request.Nome;
        cliente.Documento.CPF = request.CPF;
        cliente.Documento.RG = request.RG;

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
