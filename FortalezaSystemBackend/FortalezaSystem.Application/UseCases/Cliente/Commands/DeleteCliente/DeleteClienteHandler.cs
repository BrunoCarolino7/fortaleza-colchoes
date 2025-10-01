using FortalezaSystem.Infrastructure.Context;
using MediatR;

namespace FortalezaSystem.Application.UseCases.Cliente.Commands.DeleteCliente;

public class DeleteClienteHandler : IRequestHandler<DeleteClienteCommand, bool>
{
    private readonly DataContext _context;

    public DeleteClienteHandler(DataContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(DeleteClienteCommand request, CancellationToken cancellationToken)
    {
        var cliente = await _context.Clientes.FindAsync([request.Id], cancellationToken);
        if (cliente == null) return false;

        _context.Clientes.Remove(cliente);
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
