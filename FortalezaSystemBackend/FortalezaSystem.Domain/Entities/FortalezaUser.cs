namespace FortalezaSystem.Domain.Entities;

public class FortalezaUser : BaseEntity
{
    public string? Usuario { get; set; }
    public string? SenhaHash { get; set; }
    public bool? StatusCriar { get; set; }
    public int? ClienteId { get; set; }
    public Clientes? Cliente { get; set; }
}
