namespace FortalezaSystem.Domain.Entities;

public class Endereco : BaseEntity
{
    private Endereco()
    {

    }
    public Endereco(string logradouro, string bairro, string jardim, string localizacao, string cidade, string estado, string cep)
    {
        Logradouro = logradouro;
        Bairro = bairro;
        Jardim = jardim;
        CEP = cep;
        Localizacao = localizacao;
        Cidade = cidade;
        Estado = estado;
    }

    public string Logradouro { get; set; }
    public string Bairro { get; set; }
    public string Jardim { get; set; }
    public string CEP { get; set; }
    public string Localizacao { get; set; }
    public string Cidade { get; set; }
    public string Estado { get; set; }
    public int? ClienteId { get; set; }
    public Clientes? Cliente { get; set; }
}
