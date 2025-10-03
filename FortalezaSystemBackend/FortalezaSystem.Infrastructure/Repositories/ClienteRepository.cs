using FortalezaSystem.Domain.Repository;
using FortalezaSystem.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace FortalezaSystem.Infrastructure.Repositories;

public class ClienteRepository(DataContext dataContext) : IClienteRepository
{
    private readonly DataContext _dataContext = dataContext;

    public async Task<ClienteDto> ObterCliente(int id, CancellationToken cancellationToken = default)
    {
        var cliente = await _dataContext.Clientes
            .AsNoTracking()
            .Include(c => c.Documento)
            .Include(c => c.DadosProfissionais)!.ThenInclude(dp => dp!.EnderecoEmpresa)
            .Include(c => c.Conjuge)!.ThenInclude(conj => conj!.Documento)
            .Include(c => c.Pagamento)!.ThenInclude(p => p!.Parcelas)
            .Include(c => c.Assinatura)
            .Include(c => c.Enderecos)
            .Include(c => c.Referencias)!.ThenInclude(r => r.Endereco)
            .AsSplitQuery()
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

        return cliente == null
            ? throw new NullReferenceException()
            : new ClienteDto(
            cliente.Id,
            cliente.Nome,
            cliente.Filiacao,
            cliente.DataNascimento,
            cliente.EstadoCivil,
            cliente.Nacionalidade,
            cliente.Naturalidade,

            cliente.Documento != null
                ? new DocumentoDto(cliente.Documento.CPF, cliente.Documento.RG)
                : null,

            cliente.DadosProfissionais != null
                ? new DadosProfissionaisDto(
                    cliente.DadosProfissionais.Empresa,
                    cliente.DadosProfissionais.EmpregoAnterior,
                    cliente.DadosProfissionais.Telefone,
                    cliente.DadosProfissionais.Salario,
                    new EnderecoDto(
                        cliente.DadosProfissionais.EnderecoEmpresa.Logradouro,
                        cliente.DadosProfissionais.EnderecoEmpresa.Bairro,
                        cliente.DadosProfissionais.EnderecoEmpresa.Jardim,
                        cliente.DadosProfissionais.EnderecoEmpresa.Localizacao,
                        cliente.DadosProfissionais.EnderecoEmpresa.Cidade,
                        cliente.DadosProfissionais.EnderecoEmpresa.Estado,
                        cliente.DadosProfissionais.EnderecoEmpresa.CEP
                    )
                )
                : null,

            cliente.Conjuge != null
                ? new ConjugeDto(
                    cliente.Conjuge.Nome,
                    cliente.Conjuge.DataNascimento.HasValue
                        ? cliente.Conjuge.DataNascimento.Value
                        : null,
                    cliente.Conjuge.Naturalidade,
                    cliente.Conjuge.LocalDeTrabalho,
                    cliente.Conjuge.Documento != null
                        ? new DocumentoDto(cliente.Conjuge.Documento.CPF, cliente.Conjuge.Documento.RG)
                        : null
                )
                : null,

            cliente.Pagamento != null
                ? new InformacoesPagamentoDto(
                    cliente.Pagamento.ValorTotal,
                    cliente.Pagamento.Sinal,
                    cliente.Pagamento.DataInicio,
                    cliente.Pagamento.NumeroParcelas,
                    cliente.Pagamento.AReceber,
                    cliente.Pagamento.TotalPago,
                    cliente.Pagamento.TotalCancelado,
                    cliente.Pagamento.Parcelas != null
                        ? cliente.Pagamento.Parcelas.Select(p => new ParcelaDto(
                            p.Numero,
                            p.Valor,
                            p.Vencimento,
                            p.StatusPagamento
                        )).ToList()
                        : null
                )
                : null,

            cliente.Assinatura != null
                ? new AssinaturaDto(cliente.Assinatura.AssinaturaCliente)
                : null,

            cliente.Enderecos != null
                ? cliente.Enderecos.Select(e => new EnderecoDto(
                    e.Logradouro,
                    e.Bairro,
                    e.Jardim,
                    e.Localizacao,
                    e.Cidade,
                    e.Estado,
                    e.CEP
                )).ToList()
                : null,

            cliente.Referencias != null
                ? cliente.Referencias.Select(r => new ReferenciaDto(
                    r.Nome,
                    r.Endereco != null
                        ? new EnderecoDto(
                            r.Endereco.Logradouro,
                            r.Endereco.Bairro,
                            r.Endereco.Jardim,
                            r.Endereco.Localizacao,
                            r.Endereco.Cidade,
                            r.Endereco.Estado,
                            r.Endereco.CEP
                        )
                        : null
                )).ToList()
                : null
        );
    }

    public async Task<IEnumerable<ClienteDto>> ObterClientes(CancellationToken cancellationToken)
    {
        var clientes = await _dataContext.Clientes
         .Include(c => c.Documento)
         .Include(c => c.DadosProfissionais)!.ThenInclude(dp => dp!.EnderecoEmpresa)
         .Include(c => c.Conjuge)!.ThenInclude(conj => conj!.Documento)
         .Include(c => c.Pagamento)!.ThenInclude(p => p!.Parcelas)
         .Include(c => c.Assinatura)
         .Include(c => c.Enderecos)
         .Include(c => c.Referencias)!.ThenInclude(r => r.Endereco)
         .AsSplitQuery()
         .Select(c => new ClienteDto(
             c.Id,
             c.Nome,
             c.Filiacao,
             c.DataNascimento,
             c.EstadoCivil,
             c.Nacionalidade,
             c.Naturalidade,
             c.Documento != null ? new DocumentoDto(c.Documento.CPF, c.Documento.RG) : null,
             c.DadosProfissionais != null ? new DadosProfissionaisDto(
                 c.DadosProfissionais.Empresa,
                 c.DadosProfissionais.EmpregoAnterior,
                 c.DadosProfissionais.Telefone,
                 c.DadosProfissionais.Salario,
                 new EnderecoDto(
                     c.DadosProfissionais.EnderecoEmpresa.Logradouro,
                     c.DadosProfissionais.EnderecoEmpresa.Bairro,
                     c.DadosProfissionais.EnderecoEmpresa.Jardim,
                     c.DadosProfissionais.EnderecoEmpresa.Localizacao,
                     c.DadosProfissionais.EnderecoEmpresa.Cidade,
                     c.DadosProfissionais.EnderecoEmpresa.Estado,
                     c.DadosProfissionais.EnderecoEmpresa.CEP
                 )
             ) : null,
             c.Conjuge != null ? new ConjugeDto(
                 c.Conjuge.Nome,
                 c.Conjuge.DataNascimento,
                 c.Conjuge.Naturalidade,
                 c.Conjuge.LocalDeTrabalho,
                 c.Conjuge.Documento != null ? new DocumentoDto(c.Conjuge.Documento.CPF, c.Conjuge.Documento.RG) : null
             ) : null,
             c.Pagamento != null ? new InformacoesPagamentoDto(
                 c.Pagamento.ValorTotal,
                 c.Pagamento.Sinal,
                 c.Pagamento.DataInicio,
                 c.Pagamento.NumeroParcelas,
                 c.Pagamento.AReceber,
                 c.Pagamento.TotalPago,
                 c.Pagamento.TotalCancelado,
                 c.Pagamento.Parcelas != null ? c.Pagamento.Parcelas.Select(p => new ParcelaDto(
                     p.Numero,
                     p.Valor,
                     p.Vencimento,
                     p.StatusPagamento
                 )).ToList() : null
             ) : null,
             c.Assinatura != null ? new AssinaturaDto(c.Assinatura.AssinaturaCliente) : null,
             c.Enderecos != null ? c.Enderecos.Select(e => new EnderecoDto(
                 e.Logradouro,
                 e.Bairro,
                 e.Jardim,
                 e.Localizacao,
                 e.Cidade,
                 e.Estado,
                 e.CEP
             )).ToList() : null,
             c.Referencias != null ? c.Referencias.Select(r => new ReferenciaDto(
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
             )).ToList() : null
         ))
         .ToListAsync(cancellationToken);

        return clientes;
    }
}
