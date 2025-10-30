using FortalezaSystem.Application.UseCases.Cliente.Dtos;
using FortalezaSystem.Application.UseCases.Pedidos.Dtos;
using FortalezaSystem.Application.UseCases.Pedidos.Queries.GetPedidoByClienteId;
using FortalezaSystem.Infrastructure.Context;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace FortalezaSystem.Application.UseCases.Pedidos.Queries;

public class GetPedidosByClienteIdHandler
    : IRequestHandler<GetPedidosByClienteIdQuery, IEnumerable<PedidosAllDto>>
{
    private readonly DataContext _context;

    public GetPedidosByClienteIdHandler(DataContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<PedidosAllDto>> Handle(
        GetPedidosByClienteIdQuery request,
        CancellationToken cancellationToken)
    {
        var pedidos = await _context.Pedidos
            .Include(p => p.Itens)
                .ThenInclude(i => i.InformacoesPagamento)
                    .ThenInclude(ip => ip.Parcelas)
            .Where(p => p.ClienteId == request.ClienteId)
            .AsNoTracking()
            .Select(p => new PedidosAllDto
            {
                Id = p.Id,
                ClienteId = p.ClienteId,
                Itens = p.Itens.Select(i => new ItemPedidoDto(
                    i.Id,
                    i.ProdutoId,
                    i.Quantidade,
                    i.PrecoUnitario,
                    i.InformacoesPagamento != null
                        ? new PagamentoDto(
                            i.InformacoesPagamento.Id,
                            i.InformacoesPagamento.ValorTotal,
                            i.InformacoesPagamento.Sinal,
                            i.InformacoesPagamento.DataInicio,
                            i.InformacoesPagamento.NumeroParcelas,
                            i.InformacoesPagamento.Parcelas.Select(pa =>
                                new ParcelaDto(
                                    pa.Numero,
                                    pa.Valor,
                                    pa.Vencimento,
                                    pa.StatusPagamento
                                )).ToList()
                        )
                        : null
                )).ToList()
            })
            .ToListAsync(cancellationToken);

        return pedidos;
    }
}
