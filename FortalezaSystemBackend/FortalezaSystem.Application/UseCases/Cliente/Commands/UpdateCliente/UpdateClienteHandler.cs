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
            .Include(c => c.DadosProfissionais).ThenInclude(dp => dp.EnderecoEmpresa)
            .Include(c => c.Conjuge)
            .Include(c => c.Pagamento).ThenInclude(p => p.Parcelas)
            .Include(c => c.Estoque)
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
            request.Telefone);


        if (request.Enderecos is not null && cliente.Enderecos is not null)
        {
            foreach (var dto in request.Enderecos)
            {
                var existente = cliente.Enderecos.FirstOrDefault(e =>
                    e.Numero == dto.Numero &&
                    e.Logradouro == dto.Logradouro &&
                    e.Cidade == dto.Cidade);

                if (existente is not null)
                {
                    existente.Atualizar(dto.Numero, dto.Logradouro, dto.Bairro, dto.CEP, dto.Localizacao, dto.Cidade, dto.Estado);
                }
                else
                {
                    cliente.Enderecos.Add(new(
                        dto.Numero,
                        dto.Logradouro,
                        dto.Bairro,
                        dto.CEP,
                        dto.Localizacao,
                        dto.Cidade,
                        dto.Estado));
                }
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
                    cliente.DadosProfissionais.EnderecoEmpresa = new(e.Numero, e.Logradouro, e.Bairro, e.CEP, e.Localizacao, e.Cidade, e.Estado);
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
                request.Conjuge.CPF,
                request.Conjuge.RG);
        }

        if (request.Pagamento is not null)
        {
            cliente.Pagamento ??= new();
            cliente.Pagamento.Atualizar(
                request.Pagamento.ValorTotal,
                request.Pagamento.Sinal,
                request.Pagamento.DataInicio,
                request.Pagamento.NumeroParcelas);

            if (request.Pagamento.Parcelas is not null && cliente.Pagamento.Parcelas is not null)
            {
                foreach (var p in request.Pagamento.Parcelas)
                {
                    var existente = cliente.Pagamento.Parcelas.FirstOrDefault(x => x.Numero == p.Numero);
                    if (existente != null)
                        existente.Atualizar(p.Valor, p.Vencimento, p.StatusPagamento);
                    else
                        cliente.Pagamento.Parcelas.Add(new(p.Numero, p.Valor, p.Vencimento, p.StatusPagamento));
                }
            }
        }

        if (request.Estoque is not null && request.Estoque.Count != 0 && cliente.Estoque is not null)
        {
            foreach (var itemDto in request.Estoque)
            {
                var produtoExistente = await _context.Estoque
                    .FirstOrDefaultAsync(x => x.Id == itemDto.Id, cancellationToken);

                if (produtoExistente is null)
                    continue;

                if (!cliente.Estoque.Any(x => x.Id == produtoExistente.Id))
                    cliente.Estoque.Add(produtoExistente);
            }

            var idsMantidos = request.Estoque.Select(x => x.Id).ToHashSet();
            cliente.Estoque.RemoveAll(x => !idsMantidos.Contains(x.Id));
        }

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
