using FortalezaSystem.Domain.Entities;
using FortalezaSystem.Domain.Enuns;
using FortalezaSystem.Infrastructure.Context;
using MediatR;
using Microsoft.EntityFrameworkCore;
using PedidoEntity = FortalezaSystem.Domain.Entities.Pedidos;

namespace FortalezaSystem.Application.UseCases.Pedidos.Commands.GeatherPedido
{
    public sealed class GeatherPedidoHandler : IRequestHandler<GeatherPedidoCommand>
    {
        private readonly DataContext _db;

        public GeatherPedidoHandler(DataContext db)
        {
            _db = db;
        }

        public async Task Handle(GeatherPedidoCommand request, CancellationToken cancellationToken)
        {
            if (request.ClienteId <= 0)
                throw new ArgumentException("ClienteId inválido.");

            if (request.Itens is null || request.Itens.Count == 0)
                throw new ArgumentException("O pedido precisa ter ao menos um item.");

            var clienteExiste = await _db.Clientes
                .AsNoTracking()
                .AnyAsync(c => c.Id == request.ClienteId, cancellationToken);

            if (!clienteExiste)
                throw new InvalidOperationException("Cliente não encontrado.");

            var pedido = new PedidoEntity
            {
                ClienteId = request.ClienteId,
                Itens = []
            };

            await _db.Pedidos.AddAsync(pedido, cancellationToken);
            await _db.SaveChangesAsync(cancellationToken);

            var idsProdutos = request.Itens.Select(i => i?.ProdutoId).Distinct().ToList();

            var produtos = await _db.Estoque
                .Where(e => idsProdutos.Contains(e.Id))
                .ToListAsync(cancellationToken);

            var faltantes = idsProdutos.Except(produtos.Select(p => p.Id)).ToList();
            if (faltantes.Count > 0)
                throw new InvalidOperationException($"Produtos não encontrados no estoque: {string.Join(", ", faltantes)}");

            foreach (var itemInput in request.Itens)
            {
                var produto = produtos.FirstOrDefault(p => p.Id == itemInput.ProdutoId);
                if (produto is null)
                    throw new InvalidOperationException($"Produto com ID {itemInput.ProdutoId} não encontrado.");

                var item = new ItemPedido(
                    pedidoId: pedido.Id,
                    produtoId: produto.Id,
                    quantidade: itemInput.Quantidade,
                    precoUnitario: itemInput.PrecoUnitario
                );

                await _db.ItensPedido.AddAsync(item, cancellationToken);

                if (itemInput.Pagamento is not null)
                {
                    var pagamentoInput = itemInput.Pagamento;

                    var parcelas = (pagamentoInput.Parcelas is null || pagamentoInput.Parcelas.Count == 0)
                        ? GerarParcelas(
                            valorAParcelar: pagamentoInput.ValorTotal - pagamentoInput.Sinal,
                            numeroParcelas: pagamentoInput.NumeroParcelas,
                            dataInicio: pagamentoInput.DataInicio
                          )
                        : pagamentoInput.Parcelas
                            .OrderBy(p => p.Numero)
                            .Select(p => new Parcela(
                                numero: p.Numero,
                                valor: p.Valor,
                                vencimento: p.Vencimento,
                                statusPagamento: ParseStatus(p.StatusPagamento) ?? EStatusPagamento.Pendente
                            ))
                            .ToList();

                    var infoPagamento = new InformacoesPagamento(
                        valorTotal: pagamentoInput.ValorTotal,
                        sinal: pagamentoInput.Sinal,
                        dataInicio: pagamentoInput.DataInicio,
                        numeroParcelas: pagamentoInput.NumeroParcelas,
                        parcelas: parcelas
                    );

                    infoPagamento.ItemPedido = item;

                    await _db.InformacoesPagamento.AddAsync(infoPagamento, cancellationToken);
                }
            }

            await _db.SaveChangesAsync(cancellationToken);
        }

        private static List<Parcela> GerarParcelas(decimal valorAParcelar, int numeroParcelas, DateTime dataInicio)
        {
            var parcelas = new List<Parcela>();
            if (numeroParcelas <= 0) numeroParcelas = 1;

            if (numeroParcelas == 1)
            {
                parcelas.Add(new Parcela(
                    numero: 1,
                    valor: Math.Round(valorAParcelar, 2),
                    vencimento: dataInicio,
                    statusPagamento: EStatusPagamento.Pendente
                ));
                return parcelas;
            }

            var valorBase = Math.Floor((valorAParcelar / numeroParcelas) * 100) / 100m;
            var soma = valorBase * (numeroParcelas - 1);
            var ultima = Math.Round(valorAParcelar - soma, 2);

            for (int i = 1; i <= numeroParcelas; i++)
            {
                var venc = dataInicio.AddMonths(i - 1);
                var valor = (i < numeroParcelas) ? valorBase : ultima;

                parcelas.Add(new Parcela(
                    numero: i,
                    valor: valor,
                    vencimento: venc,
                    statusPagamento: EStatusPagamento.Pendente
                ));
            }

            return parcelas;
        }

        private static EStatusPagamento? ParseStatus(string? status)
        {
            if (string.IsNullOrWhiteSpace(status)) return null;

            return Enum.TryParse<EStatusPagamento>(status, ignoreCase: true, out var parsed)
                ? parsed
                : null;
        }
    }
}
