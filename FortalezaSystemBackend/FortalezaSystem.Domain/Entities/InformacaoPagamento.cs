using FortalezaSystem.Domain.Enuns;

namespace FortalezaSystem.Domain.Entities;

public class InformacoesPagamento : BaseEntity
{
    public InformacoesPagamento()
    {

    }
    public InformacoesPagamento(decimal? valorTotal, decimal? sinal, DateTime? dataInicio, int? numeroParcelas, ICollection<Parcela>? parcelas)
    {
        ValorTotal = valorTotal;
        Sinal = sinal;
        DataInicio = dataInicio;
        NumeroParcelas = numeroParcelas;
        Parcelas = parcelas ?? [];
    }

    public decimal? ValorTotal { get; set; }
    public decimal? Sinal { get; set; }
    public DateTime? DataInicio { get; set; }
    public int? NumeroParcelas { get; set; }

    public int? ClienteId { get; set; }
    public Clientes? Cliente { get; set; }
    public Pedidos? Pedido { get; set; }

    public ICollection<Parcela>? Parcelas { get; set; } = [];

    public decimal AReceber => Parcelas!
        .Where(p => p.StatusPagamento == EStatusPagamento.Pendente)
        .Sum(p => p.Valor) ?? 0m;

    public decimal TotalPago => Parcelas!
        .Where(p => p.StatusPagamento == EStatusPagamento.Pago)
        .Sum(p => p.Valor) ?? 0m;

    public decimal TotalCancelado => Parcelas!
        .Where(p => p.StatusPagamento == EStatusPagamento.Cancelado)
        .Sum(p => p.Valor) ?? 0m;

    public void Atualizar(
    decimal? valorTotal,
    decimal? sinal,
    DateTime? dataInicio,
    int? numeroParcelas)
    {
        if (valorTotal is not null) ValorTotal = valorTotal;
        if (sinal is not null) Sinal = sinal;
        if (dataInicio is not null) DataInicio = dataInicio;
        if (numeroParcelas is not null) NumeroParcelas = numeroParcelas;
    }


}