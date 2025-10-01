using FortalezaSystem.Domain.Entities;

namespace FortalezaSystem.Domain.SeedWork;

public abstract class AggregateRoot : BaseEntity
{
    protected AggregateRoot() : base() { }
}
