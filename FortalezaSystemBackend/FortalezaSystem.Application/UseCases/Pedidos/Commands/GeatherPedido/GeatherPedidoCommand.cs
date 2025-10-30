using MediatR;

namespace FortalezaSystem.Application.UseCases.Pedidos.Commands.GeatherPedido
{
    public sealed record GeatherParcelaInput(
        int Numero,
        decimal Valor,
        DateTime Vencimento,
        string? StatusPagamento
    );

    public sealed record GeatherPagamentoInput(
        decimal ValorTotal,
        decimal Sinal,
        DateTime DataInicio,
        int NumeroParcelas,
        IReadOnlyList<GeatherParcelaInput>? Parcelas
    );

    public sealed record GeatherPedidoItemInput(
        int ProdutoId,
        int Quantidade,
        decimal PrecoUnitario,
        GeatherPagamentoInput? Pagamento
    );

    public sealed record GeatherPedidoCommand(
        int ClienteId,
        IReadOnlyList<GeatherPedidoItemInput> Itens
    ) : IRequest;
}
