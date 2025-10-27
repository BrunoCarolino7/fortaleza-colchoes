namespace FortalezaSystem.Domain.Entities;

public class DadosPessoais : BaseEntity
{
    public string? Nome { get; set; }
    public string? Filiacao { get; set; }
    public Endereco? Endereco { get; set; }
    public string? Profissao { get; set; }
    public string? Nacionalidade { get; set; }
    public string? EstadoCivil { get; set; }
    public DateTime? DataNascimento { get; set; }
    public Documento? Documento { get; set; }
    public string? Naturalidade { get; set; }
}