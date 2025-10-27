namespace FortalezaSystem.Domain.Entities;

public class Endereco : BaseEntity
{
    private Endereco()
    {

    }
    public Endereco(string? numero, string? logradouro, string? bairro, string? localizacao, string? cidade, string? estado, string? cep)
    {
        Numero = numero;
        Logradouro = logradouro;
        Bairro = bairro;
        CEP = cep;
        Localizacao = localizacao;
        Cidade = cidade;
        Estado = estado;
    }

    public string? Numero { get; set; }
    public string? Logradouro { get; set; }
    public string? Bairro { get; set; }
    public string? CEP { get; set; }
    public string? Localizacao { get; set; }
    public string? Cidade { get; set; }
    public string? Estado { get; set; }
    public int? ClienteId { get; set; }
    public Clientes? Cliente { get; set; }

    public void Atualizar(
    string? numero,
    string? logradouro,
    string? bairro,
    string? cep,
    string? localizacao,
    string? cidade,
    string? estado)
    {
        if (numero is not null) Numero = numero;
        if (logradouro is not null) Logradouro = logradouro;
        if (bairro is not null) Bairro = bairro;
        if (cep is not null) CEP = cep;
        if (localizacao is not null) Localizacao = localizacao;
        if (cidade is not null) Cidade = cidade;
        if (estado is not null) Estado = estado;
    }

}
