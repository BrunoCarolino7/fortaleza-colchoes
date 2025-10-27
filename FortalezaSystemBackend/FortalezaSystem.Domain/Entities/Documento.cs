namespace FortalezaSystem.Domain.Entities;

public class Documento : BaseEntity
{
    private Documento()
    {

    }
    public Documento(string rG, string cPF)
    {
        RG = rG;
        CPF = cPF;
    }

    public string? RG { get; set; }
    public string? CPF { get; set; }

    public int? ClienteId { get; set; }
    public Clientes? Cliente { get; set; }
}
