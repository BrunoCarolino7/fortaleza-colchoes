using FortalezaSystem.Domain.Enuns;

namespace FortalezaSystem.Domain.Entities;

public class Parcela : BaseEntity
{
    public int Numero { get; set; }
    public decimal Valor { get; set; }
    public DateTime Vencimento { get; set; }
    public EStatusPagamento StatusPagamento { get; set; }
    // FK
    public int InformacoesPagamentoId { get; set; }
    public InformacoesPagamento InformacoesPagamento { get; set; }
}
