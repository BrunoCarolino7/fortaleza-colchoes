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
    List<FortalezaSystem.Application.UseCases.Cliente.Dtos.EnderecoDto>? Enderecos,
    FortalezaSystem.Application.UseCases.Cliente.Dtos.DadosProfissionaisDto? DadosProfissionais,
    FortalezaSystem.Application.UseCases.Cliente.Dtos.ConjugeDto? Conjuge,
    List<FortalezaSystem.Application.UseCases.Cliente.Dtos.PedidoDto>? Pedidos
) : IRequest<bool>;
