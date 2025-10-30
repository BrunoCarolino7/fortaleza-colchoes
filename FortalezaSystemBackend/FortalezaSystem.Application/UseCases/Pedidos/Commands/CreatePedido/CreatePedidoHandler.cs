using FortalezaSystem.Domain.Entities;
using FortalezaSystem.Infrastructure.Context;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace FortalezaSystem.Application.UseCases.Pedidos.Commands.CreatePedido;

using PedidoEntity = Domain.Entities.Pedidos;

public class CreatePedidoHandler(DataContext context) : IRequestHandler<CreatePedidoCommand, int?>
{
    private readonly DataContext _context = context;

    public async Task<int?> Handle(CreatePedidoCommand request, CancellationToken cancellationToken)
    {
        var dto = request.Pedido;

        if (dto is null)
            throw new ArgumentNullException(nameof(request.Pedido), "Os dados do pedido são obrigatórios.");

        var cliente = await _context.Clientes
            .Include(c => c.Pedidos)
            .FirstOrDefaultAsync(c => c.Id == dto.ClienteId, cancellationToken);


        if (cliente is null)
            throw new InvalidOperationException($"Cliente ID {dto.ClienteId} não encontrado.");

        var pedido = new PedidoEntity
        {
            ClienteId = dto.ClienteId,
            Itens = dto.Itens?.Select(i => new ItemPedido
            {
                ProdutoId = i.ProdutoId,
                Quantidade = i.Quantidade,
                PrecoUnitario = i.PrecoUnitario,
                InformacoesPagamento = i.Pagamento is not null
                    ? new InformacoesPagamento(
                        i.Pagamento.ValorTotal,
                        i.Pagamento.Sinal,
                        i.Pagamento.DataInicio,
                        i.Pagamento.NumeroParcelas,
                        i.Pagamento.Parcelas?.Select(p =>
                            new Parcela(
                                p.Numero,
                                p.Valor,
                                p.Vencimento,
                                p.StatusPagamento
                            )
                        ).ToList()
                    )
                    : null
            }).ToList() ?? [] // 🔸 Garante lista vazia se dto.Itens for null
        };

        // 🔗 Vincula o pedido ao cliente (boa prática para consistência do domínio)
        cliente.Pedidos ??= [];
        cliente.Pedidos.Add(pedido);

        // 💾 Persiste tudo
        await _context.SaveChangesAsync(cancellationToken);

        return pedido.Id;
    }
}
