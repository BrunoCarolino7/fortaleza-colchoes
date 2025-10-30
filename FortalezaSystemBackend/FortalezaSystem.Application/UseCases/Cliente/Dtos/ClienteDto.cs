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
    ICollection<EnderecoDto>? Enderecos,
    ICollection<PedidoDto>? Pedidos
)
{
    public static ClienteDto ConvertToDto(Clientes? entity)
    {
        if (entity is null)
            return null!;

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

            // Documento
            entity.Documento is not null
                ? new DocumentoDto(entity.Documento.CPF, entity.Documento.RG)
                : null,

            // Dados Profissionais
            entity.DadosProfissionais is not null
                ? new DadosProfissionaisDto(
                    entity.DadosProfissionais.Empresa,
                    entity.DadosProfissionais.Telefone,
                    entity.DadosProfissionais.Salario,
                    entity.DadosProfissionais.Profissao,
                    entity.DadosProfissionais.EnderecoEmpresa is not null
                        ? new EnderecoDto(
                            entity.DadosProfissionais.EnderecoEmpresa.Id,
                            entity.DadosProfissionais.EnderecoEmpresa.Numero,
                            entity.DadosProfissionais.EnderecoEmpresa.Logradouro,
                            entity.DadosProfissionais.EnderecoEmpresa.Bairro,
                            entity.DadosProfissionais.EnderecoEmpresa.Localizacao,
                            entity.DadosProfissionais.EnderecoEmpresa.Cidade,
                            entity.DadosProfissionais.EnderecoEmpresa.Estado,
                            entity.DadosProfissionais.EnderecoEmpresa.CEP
                        )
                        : null
                )
                : null,

            // Cônjuge
            entity.Conjuge is not null
                ? new ConjugeDto(
                    entity.Conjuge.Nome,
                    entity.Conjuge.DataNascimento,
                    entity.Conjuge.Naturalidade,
                    entity.Conjuge.LocalDeTrabalho,
                    entity.Conjuge.Documento is not null
                        ? new DocumentoDto(entity.Conjuge.Documento.CPF, entity.Conjuge.Documento.RG)
                        : null
                )
                : null,

            // Endereços
            entity.Enderecos?
                .Select(e => new EnderecoDto(
                    e.Id,
                    e.Numero,
                    e.Logradouro,
                    e.Bairro,
                    e.Localizacao,
                    e.Cidade,
                    e.Estado,
                    e.CEP
                ))
                .ToList(),

                entity.Pedidos?
                    .Select(p => new PedidoDto(
                        p.Id,
                        p.ClienteId,
                        p.Itens?.Select(i => new ItemPedidoDto(
                            i.Id,
                            i.ProdutoId,
                            i.Quantidade,
                            i.PrecoUnitario,
                            i.InformacoesPagamento is not null
                                ? new PagamentoDto(
                                    i.InformacoesPagamento.Id,
                                    i.InformacoesPagamento.ValorTotal,
                                    i.InformacoesPagamento.Sinal,
                                    i.InformacoesPagamento.DataInicio,
                                    i.InformacoesPagamento.NumeroParcelas,
                                    i.InformacoesPagamento.Parcelas?
                                        .Select(pa => new ParcelaDto(
                                            pa.Numero,
                                            pa.Valor,
                                            pa.Vencimento,
                                            pa.StatusPagamento
                                        ))
                                        .ToList()
                                )
                                : null
                        ))
                        .ToList()
                    ))
                    .ToList()

        );
    }
}
public record DocumentoDto(string? CPF, string? RG);

public record EnderecoDto(
    int? Id,
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

public record PedidoDto(
    int? Id,
    int? ClienteId,
    ICollection<ItemPedidoDto>? Itens
);

public record ItemPedidoDto(
    int? Id,
    int? ProdutoId,
    int Quantidade,
    decimal PrecoUnitario,
    PagamentoDto? Pagamento
);

public record PagamentoDto(
    int? Id,
    decimal? ValorTotal,
    decimal? Sinal,
    DateTime? DataInicio,
    int? NumeroParcelas,
    ICollection<ParcelaDto>? Parcelas
);

public record ParcelaDto(
    int? Numero,
    decimal? Valor,
    DateTime? Vencimento,
    EStatusPagamento? StatusPagamento
);
