using FortalezaSystem.Domain.Entities;
using FortalezaSystem.Domain.Enuns;

namespace FortalezaSystem.Application.UseCases.Cliente.Dtos;

public record ClienteDto(
    int Id,
    string Nome,
    string Filiacao,
    DateOnly DataNascimento,
    string EstadoCivil,
    string Nacionalidade,
    string Naturalidade,
    DocumentoDto? Documento,
    DadosProfissionaisDto? DadosProfissionais,
    ConjugeDto? Conjuge,
    InformacoesPagamentoDto? Pagamento,
    AssinaturaDto? Assinatura,
    ICollection<EnderecoDto>? Enderecos,
    ICollection<ReferenciaDto>? Referencias
)
{
    public static ClienteDto ConvertToDto(Clientes entity)
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
            entity.Documento != null ? new DocumentoDto(entity.Documento.CPF, entity.Documento.RG) : null,
            entity.DadosProfissionais != null
                ? new DadosProfissionaisDto(
                    entity.DadosProfissionais.Empresa,
                    entity.DadosProfissionais.EmpregoAnterior,
                    entity.DadosProfissionais.Telefone,
                    entity.DadosProfissionais.Salario,
                    entity.DadosProfissionais.EnderecoEmpresa != null
                        ? new EnderecoDto(
                            entity.DadosProfissionais.EnderecoEmpresa.Logradouro,
                            entity.DadosProfissionais.EnderecoEmpresa.Bairro,
                            entity.DadosProfissionais.EnderecoEmpresa.Jardim,
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
            entity.Assinatura != null ? new AssinaturaDto(entity.Assinatura.AssinaturaCliente) : null,
            entity.Enderecos?.Select(e => new EnderecoDto(
                e.Logradouro,
                e.Bairro,
                e.Jardim,
                e.Localizacao,
                e.Cidade,
                e.Estado,
                e.CEP
            )).ToList(),
            entity.Referencias?.Select(r => new ReferenciaDto(
                r.Nome,
                r.Endereco != null ? new EnderecoDto(
                    r.Endereco.Logradouro,
                    r.Endereco.Bairro,
                    r.Endereco.Jardim,
                    r.Endereco.Localizacao,
                    r.Endereco.Cidade,
                    r.Endereco.Estado,
                    r.Endereco.CEP
                ) : null
            )).ToList()
        );
    }
}

public record DocumentoDto(string CPF, string RG);

public record EnderecoDto(
    string Logradouro,
    string Bairro,
    string Jardim,
    string Localizacao,
    string Cidade,
    string Estado,
    string CEP
);

public record ReferenciaDto(string Nome, EnderecoDto? Endereco);

public record DadosProfissionaisDto(
    string Empresa,
    string EmpregoAnterior,
    string Telefone,
    decimal Salario,
    EnderecoDto EnderecoEmpresa
);

public record ConjugeDto(
    string Nome,
    DateOnly? DataNascimento,
    string Naturalidade,
    string LocalDeTrabalho,
    DocumentoDto? Documento
);

public record InformacoesPagamentoDto(
    decimal ValorTotal,
    decimal Sinal,
    DateTime DataInicio,
    int NumeroParcelas,
    decimal AReceber,
    decimal TotalPago,
    decimal TotalCancelado,
    ICollection<ParcelaDto>? Parcelas
);

public record ParcelaDto(
    int Numero,
    decimal Valor,
    DateTime Vencimento,
    EStatusPagamento StatusPagamento
);

public record AssinaturaDto(string AssinaturaCliente);
