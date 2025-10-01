namespace FortalezaSystem.Domain.Entities;

public abstract class BaseEntity
{
    protected BaseEntity(int id)
    {
        Id = id; 
    }
    protected BaseEntity(){}
    public int Id { get; private set; }
}
