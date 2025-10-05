using FortalezaSystem.Domain.Enuns;

namespace FortalezaSystem.Domain.Entities;

public class InformacoesPagamento : BaseEntity
{
    private InformacoesPagamento()
    {

    }
    public InformacoesPagamento(decimal valorTotal, decimal sinal, DateTime dataInicio, int numeroParcelas, ICollection<Parcela>? parcelas)
    {
        ValorTotal = valorTotal;
        Sinal = sinal;
        DataInicio = dataInicio;
        NumeroParcelas = numeroParcelas;
        Parcelas = parcelas ?? [];
    }

    public decimal ValorTotal { get; set; }
    public decimal Sinal { get; set; }
    public DateTime DataInicio { get; set; }
    public int NumeroParcelas { get; set; }

    public int ClienteId { get; set; }
    public Clientes Cliente { get; set; }

    public ICollection<Parcela> Parcelas { get; set; } = [];

    public decimal AReceber => Parcelas
    .Where(p => p.StatusPagamento == EStatusPagamento.Pendente)
    .Sum(p => p.Valor);

    public decimal TotalPago => Parcelas
    .Where(p => p.StatusPagamento == EStatusPagamento.Pago)
    .Sum(p => p.Valor);

    public decimal TotalCancelado => Parcelas
        .Where(p => p.StatusPagamento == EStatusPagamento.Cancelado)
        .Sum(p => p.Valor);
}