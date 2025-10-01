using FortalezaSystem.Domain.Entities;
using FortalezaSystem.Infrastructure.Context;
using MediatR;

using ClientesEntity = FortalezaSystem.Domain.Entities.Clientes;

namespace FortalezaSystem.Application.UseCases.Cliente.Commands.CreateCliente;

public class CreateClienteHandler : IRequestHandler<CreateClienteCommand, int>
{
    private readonly DataContext _context;

    public CreateClienteHandler(DataContext context)
    {
        _context = context;
    }

    public async Task<int> Handle(CreateClienteCommand request, CancellationToken cancellationToken)
    {
        var cliente = new ClientesEntity
        {
            Nome = request.Nome,
            Filiacao = request.Filiacao,
            Nacionalidade = request.Nacionalidade,
            Naturalidade = request.Naturalidade,
            EstadoCivil = request.EstadoCivil,
            DataNascimento = request.DataNascimento,

            Documento = new Documento
            {
                CPF = request.CPF,
                RG = request.RG
            },

            Enderecos = request.Enderecos.Select(e => new Endereco
            {
                Logradouro = e.Logradouro,
                Bairro = e.Bairro,
                Jardim = e.Jardim,
                CEP = e.CEP,
                Localizacao = e.Localizacao,
                Cidade = e.Cidade,
                Estado = e.Estado
            }).ToList(),

            DadosProfissionais = request.DadosProfissionais == null ? null : new DadosProfissionais
            {
                Empresa = request.DadosProfissionais.Empresa,
                EmpregoAnterior = request.DadosProfissionais.EmpregoAnterior,
                Telefone = request.DadosProfissionais.Telefone,
                Salario = request.DadosProfissionais.Salario,
                EnderecoEmpresa = new Endereco
                {
                    Logradouro = request.DadosProfissionais.EnderecoEmpresa.Logradouro,
                    Bairro = request.DadosProfissionais.EnderecoEmpresa.Bairro,
                    Jardim = request.DadosProfissionais.EnderecoEmpresa.Jardim,
                    CEP = request.DadosProfissionais.EnderecoEmpresa.CEP,
                    Localizacao = request.DadosProfissionais.EnderecoEmpresa.Localizacao,
                    Cidade = request.DadosProfissionais.EnderecoEmpresa.Cidade,
                    Estado = request.DadosProfissionais.EnderecoEmpresa.Estado
                }
            },

            Conjuge = request.Conjuge == null ? null : new Conjuge
            {
                Nome = request.Conjuge.Nome,
                DataNascimento = request.Conjuge.DataNascimento,
                Naturalidade = request.Conjuge.Naturalidade,
                LocalDeTrabalho = request.Conjuge.LocalDeTrabalho,
                Documento = new Documento
                {
                    CPF = request.Conjuge.CPF,
                    RG = request.Conjuge.RG
                }
            },

            Referencias = request.Referencias.Select(r => new Referencia
            {
                Nome = r.Nome,
                Endereco = new Endereco
                {
                    Logradouro = r.Endereco.Logradouro,
                    Bairro = r.Endereco.Bairro,
                    Jardim = r.Endereco.Jardim,
                    CEP = r.Endereco.CEP,
                    Localizacao = r.Endereco.Localizacao,
                    Cidade = r.Endereco.Cidade,
                    Estado = r.Endereco.Estado
                }
            }).ToList(),

            Assinatura = new Assinatura
            {
                AssinaturaCliente = request.Assinatura
            },

            Pagamento = request.Pagamento == null ? null : new InformacoesPagamento
            {
                ValorTotal = request.Pagamento.ValorTotal,
                Sinal = request.Pagamento.Sinal,
                DataInicio = request.Pagamento.DataInicio,
                NumeroParcelas = request.Pagamento.NumeroParcelas,
                Parcelas = request.Pagamento.Parcelas.Select(p => new Parcela
                {
                    Numero = p.Numero,
                    Valor = p.Valor,
                    Vencimento = p.Vencimento,
                    StatusPagamento = p.StatusPagamento
                }).ToList()
            }
        };

        // Adiciona apenas o cliente
        _context.Clientes.Add(cliente);

        // Salva todo o grafo de uma vez
        await _context.SaveChangesAsync(cancellationToken);

        return cliente.Id;
    }

}