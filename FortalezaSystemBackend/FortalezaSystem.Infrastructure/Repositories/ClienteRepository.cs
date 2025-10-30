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
            .Where(c => c.Status)
            .Include(c => c.Documento)
            .Include(c => c.DadosProfissionais)!.ThenInclude(dp => dp!.EnderecoEmpresa)
            .Include(c => c.Conjuge)!.ThenInclude(conj => conj!.Documento)
            .Include(c => c.Enderecos)
            .Include(c => c.Pedidos)!
                .ThenInclude(p => p.Itens)!
                    .ThenInclude(i => i.Produto)
            .Include(c => c.Pedidos)!
                .ThenInclude(p => p.Itens)!
                    .ThenInclude(i => i.InformacoesPagamento)!
                        .ThenInclude(ip => ip.Parcelas)
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
            cliente.Telefone,
            cliente.Email,
            cliente.Documento != null
                ? new Documento(cliente.Documento.RG!, cliente.Documento.CPF!)
                : null,
            cliente.DadosProfissionais != null
                ? new DadosProfissionais(
                    cliente.DadosProfissionais.Empresa,
                    cliente.DadosProfissionais.Telefone,
                    cliente.DadosProfissionais.Salario,
                    cliente.DadosProfissionais.EnderecoEmpresa != null
                        ? new Endereco(
                            cliente.DadosProfissionais.EnderecoEmpresa.Id,
                            cliente.DadosProfissionais.EnderecoEmpresa.Numero,
                            cliente.DadosProfissionais.EnderecoEmpresa.Logradouro,
                            cliente.DadosProfissionais.EnderecoEmpresa.Bairro,
                            cliente.DadosProfissionais.EnderecoEmpresa.Localizacao,
                            cliente.DadosProfissionais.EnderecoEmpresa.Cidade,
                            cliente.DadosProfissionais.EnderecoEmpresa.Estado,
                            cliente.DadosProfissionais.EnderecoEmpresa.CEP
                        )
                        : null,
                    cliente.DadosProfissionais.Profissao
                )
                : null,
            cliente.Conjuge != null
                ? new Conjuge(
                    cliente.Conjuge.Nome!,
                    cliente.Conjuge.DataNascimento,
                    cliente.Conjuge.Naturalidade!,
                    cliente.Conjuge.LocalDeTrabalho!,
                    cliente.Conjuge.Documento != null
                        ? new Documento(cliente.Conjuge.Documento.RG!, cliente.Conjuge.Documento.CPF!)
                        : null
                )
                : null,
            cliente.Enderecos?.Select(e => new Endereco(
                e.Id,
                e.Numero,
                e.Logradouro,
                e.Bairro,
                e.Localizacao,
                e.Cidade,
                e.Estado,
                e.CEP
            )).ToList(),
            cliente.Pedidos?.Select(p =>
            {
                var itens = p.Itens.Select(i =>
                {
                    var informacoesPagamento = i.InformacoesPagamento is not null
                        ? new InformacoesPagamento(
                            i.Id,
                            i.InformacoesPagamento.ValorTotal,
                            i.InformacoesPagamento.Sinal,
                            i.InformacoesPagamento.DataInicio,
                            i.InformacoesPagamento.NumeroParcelas,
                            i.InformacoesPagamento.Parcelas?.Select(parcela =>
                                new Parcela(
                                    parcela.Numero,
                                    parcela.Valor,
                                    parcela.Vencimento,
                                    parcela.StatusPagamento
                                )
                            ).ToList()
                        )
                        : null;

                    var item = new ItemPedido(
                        i.Id,
                        i.PedidoId,
                        i.ProdutoId,
                        i.Quantidade,
                        i.PrecoUnitario
                    );

                    if (informacoesPagamento is not null)
                    {
                        typeof(ItemPedido)
                            .GetProperty(nameof(ItemPedido.InformacoesPagamento))!
                            .SetValue(item, informacoesPagamento);
                    }

                    return item;
                }).ToList();

                return new Pedidos(p.ClienteId, itens);
            }).ToList()
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
            .Where(x => x.Status)
            .Include(c => c.Documento)
            .Include(c => c.Enderecos)
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
