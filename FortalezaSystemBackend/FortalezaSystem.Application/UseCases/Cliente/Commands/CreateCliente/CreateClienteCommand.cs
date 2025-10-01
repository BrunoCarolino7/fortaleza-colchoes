using FortalezaSystem.Domain.Enuns;
using MediatR;

namespace FortalezaSystem.Application.UseCases.Cliente.Commands.CreateCliente;

public record CreateClienteCommand(
    string Nome,
    string Filiacao,
    string Nacionalidade,
    string Naturalidade,
    string EstadoCivil,
    DateTime DataNascimento,
    string CPF,
    string RG,

    // Endereços
    List<EnderecoDto> Enderecos,

    // Dados Profissionais
    DadosProfissionaisDto DadosProfissionais,

    // Conjuge (opcional)
    ConjugeDto? Conjuge,

    // Referências
    List<ReferenciaDto> Referencias,

    // Assinatura
    string Assinatura,

    // Pagamento
    PagamentoDto Pagamento
) : IRequest<int>;

public record EnderecoDto(
    string Logradouro,
    string Bairro,
    string Jardim,
    string CEP,
    string Localizacao,
    string Cidade,
    string Estado
);

public record DadosProfissionaisDto(
    string Empresa,
    string EmpregoAnterior,
    string Telefone,
    decimal Salario,
    EnderecoDto EnderecoEmpresa
);

public record ConjugeDto(
    string Nome,
    DateTime? DataNascimento,
    string Naturalidade,
    string LocalDeTrabalho,
    string CPF,
    string RG
);

public record ReferenciaDto(
    string Nome,
    EnderecoDto Endereco
);

public record PagamentoDto(
    decimal ValorTotal,
    decimal Sinal,
    DateTime DataInicio,
    int NumeroParcelas,
    List<ParcelaDto> Parcelas
);

public record ParcelaDto(
    int Numero,
    decimal Valor,
    DateTime Vencimento,
    EStatusPagamento StatusPagamento
);
