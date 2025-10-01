using FortalezaSystem.Domain.Dtos;
using FortalezaSystem.Infrastructure.Context;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace FortalezaSystem.Application.UseCases.Cliente.Queries.GetClienteById;

public class GetClienteByIdHandler(DataContext context) : IRequestHandler<GetClienteByIdQuery, ClienteDto?>
{
    private readonly DataContext _context = context;

    public async Task<ClienteDto?> Handle(GetClienteByIdQuery request, CancellationToken cancellationToken)
    {
        var cliente = await _context.Clientes
            .Include(c => c.Documento)
            .Include(c => c.DadosProfissionais)
            .Include(c => c.Conjuge).ThenInclude(conj => conj.Documento)
            .Include(c => c.Pagamento).ThenInclude(p => p.Parcelas)
            .Include(c => c.Assinatura)
            .Include(c => c.Enderecos)
            .Include(c => c.Referencias)
            .AsSplitQuery()
            .FirstOrDefaultAsync(c => c.Id == request.Id, cancellationToken);

        if (cliente == null) return null;

        return new ClienteDto(
            cliente.Id,
            cliente.Nome,
            cliente.Filiacao,
            cliente.DataNascimento,
            cliente.EstadoCivil,
            cliente.Nacionalidade,
            cliente.Naturalidade,
            cliente.Documento != null ? new DocumentoDto(cliente.Documento.CPF, cliente.Documento.RG) : null,
            cliente.DadosProfissionais != null ? new DadosProfissionaisDto(
                cliente.DadosProfissionais.Empresa,
                cliente.DadosProfissionais.EmpregoAnterior,
                cliente.DadosProfissionais.Telefone
            ) : null,
            cliente.Conjuge != null ? new ConjugeDto(
                cliente.Conjuge.Nome,
                cliente.Conjuge.DataNascimento,
                cliente.Conjuge.Naturalidade,
                cliente.Conjuge.LocalDeTrabalho,
                cliente.Conjuge.Documento != null
                    ? new DocumentoDto(cliente.Conjuge.Documento.CPF, cliente.Conjuge.Documento.RG)
                    : null
            ) : null,
            cliente.Pagamento != null ? new InformacoesPagamentoDto(
                cliente.Pagamento.ValorTotal,
                cliente.Pagamento.Sinal,
                cliente.Pagamento.DataInicio,
                cliente.Pagamento.NumeroParcelas,
                cliente.Pagamento.AReceber,
                cliente.Pagamento.TotalPago,
                cliente.Pagamento.TotalCancelado
            ) : null,
            cliente.Assinatura != null ? new AssinaturaDto(cliente.Assinatura.AssinaturaCliente) : null,
            cliente.Enderecos?.Select(e => new EnderecoDto(
                e.Logradouro, e.Bairro, e.Cidade, e.Estado, e.CEP
            )).ToList(),
            cliente.Referencias?.Select(r => new ReferenciaDto(
                r.Nome, r.Cliente?.Nome ?? string.Empty
            )).ToList()
        );
    }
}
