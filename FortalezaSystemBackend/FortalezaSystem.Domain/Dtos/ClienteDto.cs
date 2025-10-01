namespace FortalezaSystem.Domain.Dtos;

public record ClienteDto(
    int Id,
    string Nome,
    string Filiacao,
    DateTime DataNascimento,
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
);

public record DocumentoDto(string CPF, string RG);
public record EnderecoDto(string Logradouro, string Bairro, string Cidade, string Estado, string CEP);
public record ReferenciaDto(string Nome, string Telefone);
public record DadosProfissionaisDto(string Empresa, string EmpregoAnterior, string Telefone);
public record ConjugeDto(
    string Nome,
    DateTime? DataNascimento,
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
    decimal TotalCancelado
);
public record AssinaturaDto(string AssinaturaCliente);