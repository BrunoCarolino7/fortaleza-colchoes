namespace FortalezaSystem.Domain.Entities;

public class Referencia : BaseEntity
{
    private Referencia()
    {

    }
    public Referencia(string nome, Endereco? endereco)
    {
        Nome = nome;
        Endereco = endereco;
    }

    public string Nome { get; set; }

    public int ClienteId { get; set; }
    public Clientes Cliente { get; set; }

    public int EnderecoId { get; set; }
    public Endereco Endereco { get; set; }
}
