namespace FortalezaSystem.Domain.Entities;

public abstract class BaseEntity
{
    protected BaseEntity() { }

    public int? Id { get; set; }
    public bool Status { get; set; }
}
