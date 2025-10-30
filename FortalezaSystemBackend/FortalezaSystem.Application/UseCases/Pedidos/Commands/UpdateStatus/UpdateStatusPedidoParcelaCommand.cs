using FortalezaSystem.Domain.Enuns;
using MediatR;

namespace FortalezaSystem.Application.UseCases.Pedidos.Commands.UpdateStatus;

public record UpdateStatusPedidoParcelaCommand(int InformacoesPagamentoId, int ParcelaId, EStatusPagamento NovoStatus) : IRequest;

