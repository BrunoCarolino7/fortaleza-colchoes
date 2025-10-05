using FortalezaSystem.Domain;
using FortalezaSystem.Domain.Entities;
using FortalezaSystem.Domain.Repository;
using FortalezaSystem.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;
using ClientEntity = FortalezaSystem.Domain.Entities.Clientes;

namespace FortalezaSystem.Infrastructure.Repositories;

public class ClienteRepository(DataContext dataContext) : IClienteRepository
{
    private readonly DataContext _dataContext = dataContext;

    public async Task<ClientEntity> ObterCliente(int id, CancellationToken cancellationToken = default)
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

        if (cliente == null)
            throw new NullReferenceException("Cliente não encontrado.");

        var entity = new ClientEntity(
            cliente.Nome,
            cliente.Filiacao,
            cliente.DataNascimento,
            cliente.EstadoCivil,
            cliente.Nacionalidade,
            cliente.Naturalidade,

            cliente.Documento != null
                ? new Documento(cliente.Documento.CPF, cliente.Documento.RG)
                : null,

            cliente.DadosProfissionais != null
                ? new DadosProfissionais(
                    cliente.DadosProfissionais.Empresa,
                    cliente.DadosProfissionais.EmpregoAnterior,
                    cliente.DadosProfissionais.Telefone,
                    cliente.DadosProfissionais.Salario,
                    new Endereco(
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
                ? new Conjuge(
                    cliente.Conjuge.Nome,
                    cliente.Conjuge.DataNascimento,
                    cliente.Conjuge.Naturalidade,
                    cliente.Conjuge.LocalDeTrabalho,
                    cliente.Conjuge.Documento != null
                        ? new Documento(cliente.Conjuge.Documento.CPF, cliente.Conjuge.Documento.RG)
                        : null
                )
                : null,

            cliente.Pagamento != null
                ? new InformacoesPagamento(
                    cliente.Pagamento.ValorTotal,
                    cliente.Pagamento.Sinal,
                    cliente.Pagamento.DataInicio,
                    cliente.Pagamento.NumeroParcelas,
                    cliente.Pagamento.Parcelas?.Select(p => new Parcela(
                        p.Numero,
                        p.Valor,
                        p.Vencimento,
                        p.StatusPagamento
                    )).ToList()
                )
                : null,

            cliente.Assinatura != null
                ? new Assinatura(cliente.Assinatura.AssinaturaCliente)
                : null,

            cliente.Enderecos?.Select(e => new Endereco(
                e.Logradouro,
                e.Bairro,
                e.Jardim,
                e.Localizacao,
                e.Cidade,
                e.Estado,
                e.CEP
            )).ToList(),

            cliente.Referencias?.Select(r => new Referencia(
                r.Nome,
                r.Endereco != null
                    ? new Endereco(
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
        );

        typeof(ClientEntity)
            .GetProperty(nameof(ClientEntity.Id))!
            .SetValue(entity, cliente.Id);

        return entity;
    }

    public async Task<PagedResult<ClientEntity>> ObterClientes(int page, int pageSize, CancellationToken cancellationToken)
    {
        var totalClientes = await _dataContext.Clientes.CountAsync(cancellationToken);

        var clientes = await _dataContext.Clientes
            .AsNoTracking()
            .Include(c => c.Documento)
            .Include(c => c.Referencias).ThenInclude(r => r.Endereco)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return new PagedResult<ClientEntity>
        {
            Data = clientes,
            TotalItems = totalClientes,
            Page = page,
            PageSize = pageSize
        };
    }

}
