using FortalezaSystem.Domain.Entities;
using FortalezaSystem.Infrastructure.Context;
using MediatR;
using ClientesEntity = FortalezaSystem.Domain.Entities.Clientes;
using EstoqueEntity = FortalezaSystem.Domain.Entities.Estoque;

namespace FortalezaSystem.Application.UseCases.Cliente.Commands.CreateCliente;

public class CreateClienteHandler(DataContext context) : IRequestHandler<CreateClienteCommand, ClientesEntity>
{
    private readonly DataContext _context = context;

    public async Task<ClientesEntity> Handle(CreateClienteCommand request, CancellationToken cancellationToken)
    {
        var documento = new Documento(request.CPF!, request.RG!);

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

        var conjuge = request.Conjuge is null
            ? null
            : new Conjuge(
                request.Conjuge.Nome!,
                request.Conjuge.DataNascimento,
                request.Conjuge.Naturalidade!,
                request.Conjuge.LocalDeTrabalho!,
                new Documento(request.Conjuge.CPF!, request.Conjuge.RG!)
            );

        var pagamento = request.Pagamento is null
            ? null
            : new InformacoesPagamento(
                request.Pagamento.ValorTotal,
                request.Pagamento.Sinal,
                request.Pagamento.DataInicio,
                request.Pagamento.NumeroParcelas,
                request.Pagamento.Parcelas?.Select(p =>
                    new Parcela(p.Numero, p.Valor, p.Vencimento, p.StatusPagamento)
                ).ToList()
            );

        var estoque = request.Estoque?.Select(es =>
            EstoqueEntity.Criar(
                es.Nome,
                es.Categoria,
                es.Tamanho,
                es.Preco,
                es.Quantidade
            )
        ).ToList();

        var cliente = new ClientesEntity(
            request.Nome,
            request.Filiacao,
            request.DataNascimento,
            request.EstadoCivil,
            request.Nacionalidade,
            request.Naturalidade,
            request.Email,
            request.Telefone,
            documento,
            dadosProfissionais,
            conjuge,
            pagamento,
            enderecos,
            estoque!
         );

        _context.Clientes.Add(cliente);
        await _context.SaveChangesAsync(cancellationToken);

        return cliente;
    }
}
