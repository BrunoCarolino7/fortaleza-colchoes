using FortalezaSystem.Domain.Dtos;
using FortalezaSystem.Infrastructure.Context;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace FortalezaSystem.Application.UseCases.Cliente.Queries.GetAllClientes;

public class GetAllClientesHandler : IRequestHandler<GetAllClientesQuery, IEnumerable<ClienteDto>>
{
    private readonly DataContext _context;

    public GetAllClientesHandler(DataContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<ClienteDto>> Handle(GetAllClientesQuery request, CancellationToken cancellationToken)
    {
        return await _context.Clientes
            .Include(c => c.Documento)
            .Include(c => c.DadosProfissionais)
            .Include(c => c.Conjuge).ThenInclude(conj => conj.Documento)
            .Include(c => c.Pagamento).ThenInclude(p => p.Parcelas)
            .Include(c => c.Assinatura)
            .Include(c => c.Enderecos)
            .Include(c => c.Referencias)
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
                    c.DadosProfissionais.Telefone
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
                    c.Pagamento.TotalCancelado
                ) : null,
                c.Assinatura != null ? new AssinaturaDto(c.Assinatura.AssinaturaCliente) : null,
                c.Enderecos != null ? c.Enderecos.Select(e => new EnderecoDto(
                    e.Logradouro, e.Bairro, e.Cidade, e.Estado, e.CEP
                )).ToList() : null,
                c.Referencias != null ? c.Referencias.Select(r => new ReferenciaDto(
                    r.Nome, r.Cliente != null ? r.Cliente.Nome : ""
                )).ToList() : null
            ))
            .ToListAsync(cancellationToken);
    }
}
