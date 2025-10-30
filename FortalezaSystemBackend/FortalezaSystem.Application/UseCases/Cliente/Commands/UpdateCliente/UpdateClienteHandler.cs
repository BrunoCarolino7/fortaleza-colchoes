using FortalezaSystem.Infrastructure.Context;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace FortalezaSystem.Application.UseCases.Cliente.Commands.UpdateCliente;

public class UpdateClienteHandler(DataContext context) : IRequestHandler<UpdateClienteCommand, bool>
{
    private readonly DataContext _context = context;

    public async Task<bool> Handle(UpdateClienteCommand request, CancellationToken cancellationToken)
    {
        var cliente = await _context.Clientes
            .Include(c => c.Enderecos)
            .Include(c => c.Documento)
            .Include(c => c.DadosProfissionais).ThenInclude(dp => dp.EnderecoEmpresa)
            .Include(c => c.Conjuge).ThenInclude(conj => conj.Documento)
            .Include(c => c.Pedidos)!.ThenInclude(p => p.Itens)!.ThenInclude(i => i.InformacoesPagamento)!.ThenInclude(p => p.Parcelas)
            .AsSplitQuery()
            .FirstOrDefaultAsync(c => c.Id == request.Id, cancellationToken);

        if (cliente is null)
            return false;

        cliente.AtualizarDados(
            request.Nome,
            request.Filiacao,
            request.Nacionalidade,
            request.Naturalidade,
            request.EstadoCivil,
            request.DataNascimento,
            request.Email,
            request.Telefone,
            request.CPF,
            request.RG);

        if (request.Enderecos is not null && cliente.Enderecos is not null)
        {
            foreach (var dto in request.Enderecos)
            {
                var existente = cliente.Enderecos.FirstOrDefault(e => e.Id == dto.Id);

                if (existente is not null)
                    existente.Atualizar(dto.Numero, dto.Logradouro, dto.Bairro, dto.CEP, dto.Localizacao, dto.Cidade, dto.Estado);
                else
                    cliente.Enderecos.Add(new(0, dto.Numero, dto.Logradouro, dto.Bairro, dto.Localizacao, dto.Cidade, dto.Estado, dto.CEP));
            }
        }

        if (request.DadosProfissionais is not null)
        {
            cliente.DadosProfissionais ??= new();
            cliente.DadosProfissionais.Atualizar(
                request.DadosProfissionais.Empresa,
                request.DadosProfissionais.Telefone,
                request.DadosProfissionais.Salario,
                request.DadosProfissionais.Profissao);

            if (request.DadosProfissionais.EnderecoEmpresa is not null)
            {
                var e = request.DadosProfissionais.EnderecoEmpresa;
                if (cliente.DadosProfissionais.EnderecoEmpresa is not null)
                    cliente.DadosProfissionais.EnderecoEmpresa.Atualizar(e.Numero, e.Logradouro, e.Bairro, e.CEP, e.Localizacao, e.Cidade, e.Estado);
                else
                    cliente.DadosProfissionais.EnderecoEmpresa = new(0, e.Numero, e.Logradouro, e.Bairro, e.Localizacao, e.Cidade, e.Estado, e.CEP);
            }
        }

        if (request.Conjuge is not null)
        {
            cliente.Conjuge ??= new();
            cliente.Conjuge.Atualizar(
                request.Conjuge.Nome,
                request.Conjuge.DataNascimento,
                request.Conjuge.Naturalidade,
                request.Conjuge.LocalDeTrabalho,
                request.Conjuge.Documento?.CPF,
                request.Conjuge.Documento?.RG);
        }

        if (request.Pedidos is not null)
        {
            cliente.Pedidos ??= [];

            foreach (var pedidoDto in request.Pedidos)
            {
                var pedidoExistente = cliente.Pedidos.FirstOrDefault();

                if (pedidoExistente is null)
                {
                    // cria novo pedido
                    pedidoExistente = new()
                    {
                        ClienteId = cliente.Id
                    };
                    cliente.Pedidos.Add(pedidoExistente);
                }

                // Atualiza Itens
                pedidoExistente.Itens ??= [];

                foreach (var itemDto in pedidoDto.Itens)
                {
                    var itemExistente = pedidoExistente.Itens.FirstOrDefault(i => i.ProdutoId == itemDto.ProdutoId);

                    if (itemExistente is null)
                    {
                        // cria novo item com pagamento
                        var novoItem = new FortalezaSystem.Domain.Entities.ItemPedido
                        {
                            ProdutoId = itemDto.ProdutoId,
                            Quantidade = itemDto.Quantidade,
                            PrecoUnitario = itemDto.PrecoUnitario,
                            InformacoesPagamento = itemDto.Pagamento is not null
                                ? new FortalezaSystem.Domain.Entities.InformacoesPagamento(
                                    itemDto.Pagamento.ValorTotal,
                                    itemDto.Pagamento.Sinal,
                                    itemDto.Pagamento.DataInicio,
                                    itemDto.Pagamento.NumeroParcelas,
                                    itemDto.Pagamento.Parcelas?.Select(p =>
                                        new FortalezaSystem.Domain.Entities.Parcela(p.Numero, p.Valor, p.Vencimento, p.StatusPagamento)
                                    ).ToList()
                                )
                                : null
                        };
                        pedidoExistente.Itens.Add(novoItem);
                    }
                    else
                    {
                        // atualiza item existente
                        itemExistente.PrecoUnitario = itemDto.PrecoUnitario;
                        itemExistente.Quantidade = itemDto.Quantidade;

                        if (itemDto.Pagamento is not null)
                        {
                            var pag = itemExistente.InformacoesPagamento;
                            if (pag is null)
                            {
                                itemExistente.InformacoesPagamento = new FortalezaSystem.Domain.Entities.InformacoesPagamento(
                                    itemDto.Pagamento.ValorTotal,
                                    itemDto.Pagamento.Sinal,
                                    itemDto.Pagamento.DataInicio,
                                    itemDto.Pagamento.NumeroParcelas,
                                    itemDto.Pagamento.Parcelas?.Select(p =>
                                        new FortalezaSystem.Domain.Entities.Parcela(p.Numero, p.Valor, p.Vencimento, p.StatusPagamento)
                                    ).ToList()
                                );
                            }
                            else
                            {
                                pag.Atualizar(
                                    itemDto.Pagamento.ValorTotal,
                                    itemDto.Pagamento.Sinal,
                                    itemDto.Pagamento.DataInicio,
                                    itemDto.Pagamento.NumeroParcelas
                                );

                                if (itemDto.Pagamento.Parcelas is not null && pag.Parcelas is not null)
                                {
                                    foreach (var p in itemDto.Pagamento.Parcelas)
                                    {
                                        var parcelaExistente = pag.Parcelas.FirstOrDefault(x => x.Numero == p.Numero);
                                        if (parcelaExistente != null)
                                            parcelaExistente.Atualizar(p.Valor, p.Vencimento, p.StatusPagamento);
                                        else
                                            pag.Parcelas.Add(new(p.Numero, p.Valor, p.Vencimento, p.StatusPagamento));
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
