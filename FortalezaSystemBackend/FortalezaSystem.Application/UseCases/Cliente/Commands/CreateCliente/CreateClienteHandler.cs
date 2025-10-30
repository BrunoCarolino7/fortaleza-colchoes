using FortalezaSystem.Domain.Entities;
using FortalezaSystem.Infrastructure.Context;
using MediatR;
using ClientesEntity = FortalezaSystem.Domain.Entities.Clientes;
using ItemPedidoEntity = FortalezaSystem.Domain.Entities.ItemPedido;
using PedidosEntity = FortalezaSystem.Domain.Entities.Pedidos;

namespace FortalezaSystem.Application.UseCases.Cliente.Commands.CreateCliente;

public class CreateClienteHandler(DataContext context)
    : IRequestHandler<CreateClienteCommand, ClientesEntity>
{
    private readonly DataContext _context = context;

    public async Task<ClientesEntity> Handle(CreateClienteCommand request, CancellationToken cancellationToken)
    {
        // Documento
        var documento = new Documento(request.CPF!, request.RG!);

        // Endereços
        var enderecos = request.Enderecos?.Select(e =>
            new Endereco(
                e.Numero,
                e.Logradouro,
                e.Bairro,
                e.Localizacao,
                e.Cidade,
                e.Estado,
                e.CEP
            )
        ).ToList();

        // Dados Profissionais
        var dadosProfissionais = request.DadosProfissionais is null
            ? null
            : new DadosProfissionais(
                request.DadosProfissionais.Empresa,
                request.DadosProfissionais.Telefone,
                request.DadosProfissionais.Salario,
                new Endereco(
                    request.DadosProfissionais.EnderecoEmpresa!.Numero,
                    request.DadosProfissionais.EnderecoEmpresa.Logradouro,
                    request.DadosProfissionais.EnderecoEmpresa.Bairro,
                    request.DadosProfissionais.EnderecoEmpresa.Localizacao,
                    request.DadosProfissionais.EnderecoEmpresa.Cidade,
                    request.DadosProfissionais.EnderecoEmpresa.Estado,
                    request.DadosProfissionais.EnderecoEmpresa.CEP
                ),
                request.DadosProfissionais.Profissao
            );

        // Cônjuge
        var conjuge = request.Conjuge is null
            ? null
            : new Conjuge(
                request.Conjuge.Nome!,
                request.Conjuge.DataNascimento,
                request.Conjuge.Naturalidade!,
                request.Conjuge.LocalDeTrabalho!,
                new Documento(request.Conjuge.CPF!, request.Conjuge.RG!)
            );

        var cliente = new ClientesEntity(
            request.Nome,
            request.Filiacao,
            request.DataNascimento,
            request.EstadoCivil,
            request.Nacionalidade,
            request.Naturalidade,
            request.Telefone,
            request.Email,
            documento,
            dadosProfissionais,
            conjuge,
            enderecos,
            pedidos: []
        );

        _context.Clientes.Add(cliente);
        await _context.SaveChangesAsync(cancellationToken);


        if (request.Pedidos != null && request.Pedidos.Any())
        {
            foreach (var pedidoRequest in request.Pedidos)
            {
                var pedido = new PedidosEntity(cliente.Id, []);

                foreach (var itemRequest in pedidoRequest.Itens)
                {
                    var informacoesPagamento = itemRequest.Pagamento is null
                        ? null
                        : new InformacoesPagamento(
                            itemRequest.Pagamento.ValorTotal,
                            itemRequest.Pagamento.Sinal,
                            itemRequest.Pagamento.DataInicio,
                            itemRequest.Pagamento.NumeroParcelas,
                            itemRequest.Pagamento.Parcelas?.Select(p =>
                                new Parcela(p.Numero, p.Valor, p.Vencimento, p.StatusPagamento)
                            ).ToList()
                        );

                    var itemPedido = new ItemPedidoEntity(
                        pedido.Id,
                        itemRequest.ProdutoId,
                        itemRequest.Quantidade,
                        itemRequest.PrecoUnitario
                    );

                    if (informacoesPagamento is not null)
                    {
                        typeof(InformacoesPagamento)
                            .GetProperty(nameof(InformacoesPagamento.ItemPedidoId))!
                            .SetValue(informacoesPagamento, itemPedido.Id);
                        typeof(InformacoesPagamento)
                            .GetProperty(nameof(InformacoesPagamento.ItemPedido))!
                            .SetValue(informacoesPagamento, itemPedido);

                        typeof(ItemPedidoEntity)
                            .GetProperty(nameof(ItemPedidoEntity.InformacoesPagamento))!
                            .SetValue(itemPedido, informacoesPagamento);
                    }

                    pedido.Itens.Add(itemPedido);
                }

                cliente.Pedidos!.Add(pedido);
            }

            _context.Update(cliente);
            await _context.SaveChangesAsync(cancellationToken);
        }

        return cliente;
    }
}
