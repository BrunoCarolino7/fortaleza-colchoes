using FortalezaSystem.Application.UseCases.Pedidos.Commands.UpdateStatus;
using FortalezaSystem.Infrastructure.Context;
using MediatR;
using Microsoft.EntityFrameworkCore;

public class UpdateStatusPedidoParcelaHandler(DataContext context)
    : IRequestHandler<UpdateStatusPedidoParcelaCommand>
{
    private readonly DataContext _context = context;

    public async Task Handle(UpdateStatusPedidoParcelaCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var parcela = await _context.Parcelas
                .Include(p => p.InformacoesPagamento)
                .FirstOrDefaultAsync(p =>
                    p.InformacoesPagamentoId == request.InformacoesPagamentoId &&
                    p.Numero == request.ParcelaId,
                    cancellationToken);

            if (parcela == null)
                throw new Exception($"Parcela com ID {request.ParcelaId} não encontrada.");

            parcela.AtualizarStatus(request.NovoStatus);

            await _context.SaveChangesAsync(cancellationToken);
        }
        catch
        {
            throw;
        }
    }
}
