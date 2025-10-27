using FortalezaSystem.Application.UseCases.Cliente.Dtos;
using FortalezaSystem.Application.UseCases.Pedidos.Dtos;
using FortalezaSystem.Application.UseCases.Pedidos.Queries.GetPedidoByClienteId;
using FortalezaSystem.Infrastructure.Context;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace FortalezaSystem.Application.UseCases.Pedidos.Queries;

public class GetPedidosByClienteIdHandler : IRequestHandler<GetPedidosByClienteIdQuery, IEnumerable<PedidosAllDto>>
{
    private readonly DataContext _context;

    public GetPedidosByClienteIdHandler(DataContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<PedidosAllDto>> Handle(GetPedidosByClienteIdQuery request, CancellationToken cancellationToken)
    {
        var pedidos = _context.Pedidos
            .Include(p => p.InformacoesPagamento)
                .ThenInclude(ip => ip!.Parcelas)
            .Where(p => p.ClienteId == request.ClienteId)
            .AsNoTracking()
            .Select(p => new PedidosAllDto
            {
                Id = p.Id,
                ClienteId = p.ClienteId,
                InformacoesPagamento = p.InformacoesPagamento == null
                ? null
                : new InformacoesPagamentoDto(
                    p.InformacoesPagamento.ValorTotal,
                    p.InformacoesPagamento.Sinal,
                    p.InformacoesPagamento.DataInicio,
                    p.InformacoesPagamento.NumeroParcelas,
                    p.InformacoesPagamento.AReceber,
                    p.InformacoesPagamento.TotalPago,
                    p.InformacoesPagamento.TotalCancelado,
                    p.InformacoesPagamento.Parcelas!.Select(parcela =>
                        new ParcelaDto(
                            parcela.Numero,
                            parcela.Valor,
                            parcela.Vencimento,
                            parcela.StatusPagamento
                        )).ToList())
            });

        return pedidos;
    }
}
