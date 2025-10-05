using FortalezaSystem.Domain.SeedWork;

namespace FortalezaSystem.Domain.Entities;

public class Clientes : AggregateRoot
{

    private Clientes() { }

    public Clientes(
    string nome,
    string filiacao,
    DateOnly dataNascimento,
    string estadoCivil,
    string nacionalidade,
    string naturalidade,
    Documento? documento,
    DadosProfissionais? dadosProfissionais,
    Conjuge? conjuge,
    InformacoesPagamento? pagamento,
    Assinatura? assinatura,
    ICollection<Endereco>? enderecos,
    ICollection<Referencia>? referencias
)
    {
        Nome = nome;
        Filiacao = filiacao;
        DataNascimento = dataNascimento;
        EstadoCivil = estadoCivil;
        Nacionalidade = nacionalidade;
        Naturalidade = naturalidade;
        Documento = documento;
        DadosProfissionais = dadosProfissionais;
        Conjuge = conjuge;
        Pagamento = pagamento;
        Assinatura = assinatura;
        Enderecos = enderecos ?? [];
        Referencias = referencias ?? [];
    }

    public string Nome { get; private set; } = default!;
    public string Filiacao { get; private set; } = default!;
    public DateOnly DataNascimento { get; private set; }
    public string EstadoCivil { get; private set; } = default!;
    public string Nacionalidade { get; private set; } = default!;
    public string Naturalidade { get; private set; } = default!;

    public ICollection<Endereco> Enderecos { get; private set; } = [];
    public ICollection<Referencia> Referencias { get; private set; } = [];

    public Documento? Documento { get; private set; }
    public DadosProfissionais? DadosProfissionais { get; private set; }
    public Conjuge? Conjuge { get; private set; }
    public InformacoesPagamento? Pagamento { get; private set; }
    public Assinatura? Assinatura { get; private set; }
    public FortalezaUser? FortalezaUser { get; private set; }

    public void AtualizarDados(string nome, string cpf, string rg)
    {
        if (string.IsNullOrWhiteSpace(nome))
            throw new ArgumentException("O nome não pode ser vazio.");
        if (string.IsNullOrWhiteSpace(cpf))
            throw new ArgumentException("O CPF não pode ser vazio.");
        if (string.IsNullOrWhiteSpace(rg))
            throw new ArgumentException("O RG não pode ser vazio.");
        if (Documento is null)
            throw new ArgumentException("Não há documento registrado para essa pessoa.");

        Nome = nome;
        Documento.CPF = cpf;
        Documento.RG = rg;
    }
}
