using FortalezaSystem.Domain.Entities;
using FortalezaSystem.Infrastructure.Context;
using MediatR;
using ClientesEntity = FortalezaSystem.Domain.Entities.Clientes;

namespace FortalezaSystem.Application.UseCases.Cliente.Commands.CreateCliente;

public class CreateClienteHandler : IRequestHandler<CreateClienteCommand, ClientesEntity>
{
    private readonly DataContext _context;

    public CreateClienteHandler(DataContext context)
    {
        _context = context;
    }

    public async Task<ClientesEntity> Handle(CreateClienteCommand request, CancellationToken cancellationToken)
    {
        var documento = new Documento(request.CPF, request.RG);

        var enderecos = request.Enderecos?.Select(e =>
            new Endereco(
                e.Logradouro,
                e.Bairro,
                e.Jardim,
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
                request.DadosProfissionais.EmpregoAnterior,
                request.DadosProfissionais.Telefone,
                request.DadosProfissionais.Salario,
                new Endereco(
                    request.DadosProfissionais.EnderecoEmpresa.Logradouro,
                    request.DadosProfissionais.EnderecoEmpresa.Bairro,
                    request.DadosProfissionais.EnderecoEmpresa.Jardim,
                    request.DadosProfissionais.EnderecoEmpresa.Localizacao,
                    request.DadosProfissionais.EnderecoEmpresa.Cidade,
                    request.DadosProfissionais.EnderecoEmpresa.Estado,
                    request.DadosProfissionais.EnderecoEmpresa.CEP
                )
            );

        var conjuge = request.Conjuge is null
            ? null
            : new Conjuge(
                request.Conjuge.Nome,
                request.Conjuge.DataNascimento,
                request.Conjuge.Naturalidade,
                request.Conjuge.LocalDeTrabalho,
                new Documento(request.Conjuge.CPF, request.Conjuge.RG)
            );

        var referencias = request.Referencias?.Select(r =>
            new Referencia(
                r.Nome,
                new Endereco(
                    r.Endereco.Logradouro,
                    r.Endereco.Bairro,
                    r.Endereco.Jardim,
                    r.Endereco.Localizacao,
                    r.Endereco.Cidade,
                    r.Endereco.Estado,
                    r.Endereco.CEP
                )
            )
        ).ToList();

        var assinatura = new Assinatura(request.Assinatura);

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

        var cliente = new ClientesEntity(
            request.Nome,
            request.Filiacao,
            request.DataNascimento,
            request.EstadoCivil,
            request.Nacionalidade,
            request.Naturalidade,
            documento,
            dadosProfissionais,
            conjuge,
            pagamento,
            assinatura,
            enderecos,
            referencias
        );

        _context.Clientes.Add(cliente);
        await _context.SaveChangesAsync(cancellationToken);

        return cliente;
    }
}
