using FortalezaSystem.Domain.Enuns;
using MediatR;
using ClientesEntity = FortalezaSystem.Domain.Entities.Clientes;

namespace FortalezaSystem.Application.UseCases.Cliente.Commands.CreateCliente;

public record CreateClienteCommand(
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
    List<PedidoDto>? Pedidos
) : IRequest<ClientesEntity>;

#region --- Sub DTOs ---

public record EnderecoDto(
    int Id,
    string? Numero,
    string? Logradouro,
    string? Bairro,
    string? CEP,
    string? Localizacao,
    string? Cidade,
    string? Estado
);
public record DadosProfissionaisDto(
    string? Empresa,
    string? Telefone,
    decimal? Salario,
    EnderecoDto? EnderecoEmpresa,
    string? Profissao
);

public record ConjugeDto(
    string? Nome,
    DateOnly? DataNascimento,
    string? Naturalidade,
    string? LocalDeTrabalho,
    string? CPF,
    string? RG
);

public record PedidoDto(
    List<ItemPedidoDto> Itens
);

public record ItemPedidoDto(
    int ProdutoId,
    int Quantidade,
    decimal PrecoUnitario,
    PagamentoDto? Pagamento
);

public record PagamentoDto(
    decimal? ValorTotal,
    decimal? Sinal,
    DateTime? DataInicio,
    int? NumeroParcelas,
    List<ParcelaDto>? Parcelas
);

public record ParcelaDto(
    int? Numero,
    decimal? Valor,
    DateTime? Vencimento,
    EStatusPagamento? StatusPagamento
);
#endregion
