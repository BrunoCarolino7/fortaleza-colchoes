namespace FortalezaSystem.Domain.Entities;

public class Conjuge : BaseEntity
{
    private Conjuge()
    {

    }
    public Conjuge(string nome, DateOnly? dataNascimento, string naturalidade, string localDeTrabalho, Documento? documento)
    {
        Nome = nome;
        DataNascimento = dataNascimento;
        Naturalidade = naturalidade;
        LocalDeTrabalho = localDeTrabalho;
        Documento = documento;
    }

    public string Nome { get; set; }
    public DateOnly? DataNascimento { get; set; }
    public string Naturalidade { get; set; }
    public string LocalDeTrabalho { get; set; }

    public int ClienteId { get; set; }
    public Clientes Cliente { get; set; }

    public int DocumentoId { get; set; }
    public Documento? Documento { get; set; }
}
