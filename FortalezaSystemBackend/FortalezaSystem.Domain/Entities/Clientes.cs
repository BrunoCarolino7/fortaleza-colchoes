using FortalezaSystem.Domain.SeedWork;

namespace FortalezaSystem.Domain.Entities;

public class Clientes : AggregateRoot
{
    public string Nome { get; set; }
    public string Filiacao { get; set; }
    public DateOnly DataNascimento { get; set; }
    public string EstadoCivil { get; set; }
    public string Nacionalidade { get; set; }
    public string Naturalidade { get; set; }

    // Relacionamentos 1:N
    public ICollection<Endereco>? Enderecos { get; set; } = [];
    public ICollection<Referencia>? Referencias { get; set; } = [];

    // Relacionamentos 1:1
    public Documento? Documento { get; set; }
    public DadosProfissionais? DadosProfissionais { get; set; }
    public Conjuge? Conjuge { get; set; }
    public InformacoesPagamento? Pagamento { get; set; }
    public Assinatura? Assinatura { get; set; }
    public FortalezaUser? FortalezaUser { get; set; }
}
