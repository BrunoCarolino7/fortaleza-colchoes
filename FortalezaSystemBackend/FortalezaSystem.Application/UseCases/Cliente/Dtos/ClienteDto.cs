using FortalezaSystem.Domain.Entities;
using FortalezaSystem.Domain.Enuns;

namespace FortalezaSystem.Application.UseCases.Cliente.Dtos;

public record ClienteDto(
    int? Id,
    string? Nome,
    string? Filiacao,
    DateOnly? DataNascimento,
    string? EstadoCivil,
    string? Nacionalidade,
    string? Naturalidade,
    string? Email,
    string? Telefone,
    DocumentoDto? Documento,
    DadosProfissionaisDto? DadosProfissionais,
    ConjugeDto? Conjuge,
    InformacoesPagamentoDto? Pagamento,
    ICollection<EnderecoDto>? Enderecos)
{
    public static ClienteDto ConvertToDto(Clientes? entity)
    {
        if (entity == null) return null!;

        return new ClienteDto(
            entity.Id,
            entity.Nome,
            entity.Filiacao,
            entity.DataNascimento,
            entity.EstadoCivil,
            entity.Nacionalidade,
            entity.Naturalidade,
            entity.Email,
            entity.Telefone,
            entity.Documento != null ? new DocumentoDto(entity.Documento.CPF!, entity.Documento.RG!) : null,
            entity.DadosProfissionais != null
                ? new DadosProfissionaisDto(
                    entity.DadosProfissionais.Empresa,
                    entity.DadosProfissionais.Telefone,
                    entity.DadosProfissionais.Salario,
                    entity.DadosProfissionais.Profissao,
                    entity.DadosProfissionais.EnderecoEmpresa != null
                        ? new EnderecoDto(
                            entity.DadosProfissionais.EnderecoEmpresa.Numero,
                            entity.DadosProfissionais.EnderecoEmpresa.Logradouro,
                            entity.DadosProfissionais.EnderecoEmpresa.Bairro,
                            entity.DadosProfissionais.EnderecoEmpresa.Localizacao,
                            entity.DadosProfissionais.EnderecoEmpresa.Cidade,
                            entity.DadosProfissionais.EnderecoEmpresa.Estado,
                            entity.DadosProfissionais.EnderecoEmpresa.CEP
                        )
                        : null!
                )
                : null,
            entity.Conjuge != null
                ? new ConjugeDto(
                    entity.Conjuge.Nome,
                    entity.Conjuge.DataNascimento,
                    entity.Conjuge.Naturalidade,
                    entity.Conjuge.LocalDeTrabalho,
                    entity.Conjuge.Documento != null ? new DocumentoDto(entity.Conjuge.Documento.CPF, entity.Conjuge.Documento.RG) : null
                )
                : null,
            entity.Pagamento != null
                ? new InformacoesPagamentoDto(
                    entity.Pagamento.ValorTotal,
                    entity.Pagamento.Sinal,
                    entity.Pagamento.DataInicio,
                    entity.Pagamento.NumeroParcelas,
                    entity.Pagamento.AReceber,
                    entity.Pagamento.TotalPago,
                    entity.Pagamento.TotalCancelado,
                    entity.Pagamento.Parcelas?.Select(p => new ParcelaDto(
                        p.Numero,
                        p.Valor,
                        p.Vencimento,
                        p.StatusPagamento
                    )).ToList()
                )
                : null,

            entity.Enderecos?.Select(e => new EnderecoDto(
                e.Numero,
                e.Logradouro,
                e.Bairro,
                e.Localizacao,
                e.Cidade,
                e.Estado,
                e.CEP
            )).ToList()
        );
    }
}

public record DocumentoDto(string? CPF, string? RG);

public record EnderecoDto(
    string? Numero,
    string? Logradouro,
    string? Bairro,
    string? Localizacao,
    string? Cidade,
    string? Estado,
    string? CEP
);

public record DadosProfissionaisDto(
    string? Empresa,
    string? Telefone,
    decimal? Salario,
    string? Profissao,
    EnderecoDto? EnderecoEmpresa
);

public record ConjugeDto(
    string? Nome,
    DateOnly? DataNascimento,
    string? Naturalidade,
    string? LocalDeTrabalho,
    DocumentoDto? Documento
);

public record InformacoesPagamentoDto(
    decimal? ValorTotal,
    decimal? Sinal,
    DateTime? DataInicio,
    int? NumeroParcelas,
    decimal? AReceber,
    decimal? TotalPago,
    decimal? TotalCancelado,
    ICollection<ParcelaDto>? Parcelas
);

public record ParcelaDto(
    int? Numero,
    decimal? Valor,
    DateTime? Vencimento,
    EStatusPagamento? StatusPagamento
);