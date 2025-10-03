using FortalezaSystem.Domain.Enuns;

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
);

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
