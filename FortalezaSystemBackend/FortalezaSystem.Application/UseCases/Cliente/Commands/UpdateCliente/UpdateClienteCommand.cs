using FortalezaSystem.Application.UseCases.Cliente.Commands.CreateCliente;
using MediatR;

namespace FortalezaSystem.Application.UseCases.Cliente.Commands.UpdateCliente;

public record UpdateClienteCommand(
    int Id,
    string? Nome,
    string? Filiacao,
    string? Nacionalidade,
    string? Naturalidade,
    string? EstadoCivil,
    DateOnly? DataNascimento,
    string? CPF,
    string? RG,
    string? Email,
    string? Telefone,
    List<EnderecoDto>? Enderecos,
    DadosProfissionaisDto? DadosProfissionais,
    ConjugeDto? Conjuge,
    PagamentoDto? Pagamento,
    List<EstoqueDto>? Estoque
) : IRequest<bool>;
