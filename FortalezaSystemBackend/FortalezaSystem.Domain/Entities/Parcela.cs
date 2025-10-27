using FortalezaSystem.Domain.Enuns;

namespace FortalezaSystem.Domain.Entities;

public class Parcela : BaseEntity
{
    private Parcela() { }

    public Parcela(int? numero, decimal? valor, DateTime? vencimento, EStatusPagamento? statusPagamento)
    {
        Numero = numero;
        Valor = valor;
        Vencimento = vencimento;
        StatusPagamento = statusPagamento;
    }

    public int? Numero { get; private set; }
    public decimal? Valor { get; private set; }
    public DateTime? Vencimento { get; private set; }
    public EStatusPagamento? StatusPagamento { get; private set; }

    public int? InformacoesPagamentoId { get; private set; }
    public InformacoesPagamento? InformacoesPagamento { get; private set; } = default!;

    public void MarcarComoPago()
    {
        if (StatusPagamento == EStatusPagamento.Cancelado)
            throw new InvalidOperationException("Não é possível pagar uma parcela cancelada.");

        StatusPagamento = EStatusPagamento.Pago;
    }

    public void Cancelar()
    {
        if (StatusPagamento == EStatusPagamento.Pago)
            throw new InvalidOperationException("Não é possível cancelar uma parcela já paga.");

        StatusPagamento = EStatusPagamento.Cancelado;
    }
    public void Atualizar(
    decimal? valor,
    DateTime? vencimento,
    EStatusPagamento? statusPagamento)
    {
        if (valor is not null) Valor = valor;
        if (vencimento is not null) Vencimento = vencimento;
        if (statusPagamento is not null) StatusPagamento = statusPagamento.Value;
    }

}
