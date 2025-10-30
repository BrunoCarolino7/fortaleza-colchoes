using FortalezaSystem.Application.UseCases.Pedidos.Commands.GeatherPedido;
using FortalezaSystem.Application.UseCases.Pedidos.Commands.UpdateStatus;
using FortalezaSystem.Application.UseCases.Pedidos.Queries.GetAllPedido;
using FortalezaSystem.Application.UseCases.Pedidos.Queries.GetPedidoByClienteId;
using FortalezaSystem.Domain.Enuns;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace FortalezaSystem.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PedidoController(IMediator mediator) : ControllerBase
{
    private readonly IMediator _mediator = mediator;

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken = default)
    {
        var result = await _mediator.Send(new GetPedidosQuery(), cancellationToken);

        if (result == null)
            return NotFound("Nenhum cliente encontrado.");

        return Ok(result);
    }

    [HttpGet("cliente/{clienteId:int}")]
    public async Task<IActionResult> GetByClienteId(int clienteId)
    {
        var pedidos = await _mediator.Send(new GetPedidosByClienteIdQuery(clienteId));

        if (!pedidos.Any())
            return NotFound($"Nenhum pedido encontrado para o ClienteId {clienteId}");

        return Ok(pedidos);
    }

    [HttpPost("gather/cliente/{clienteId:int}")]
    public async Task<IActionResult> GatherClientToOrder(
        int clienteId,
        [FromBody] List<GeatherPedidoItemInput> itens,
        CancellationToken ct)
    {
        if (itens is null || itens.Count == 0)
            return BadRequest("Envie ao menos um item.");

        await _mediator.Send(new GeatherPedidoCommand(clienteId, itens), ct);
        return NoContent();
    }

    [HttpPut("status")]
    public async Task<IActionResult> PutStatusParcela(
        [FromQuery] int InformacoesPagamentoId,
        [FromQuery] int ParcelaId,
        [FromBody] EStatusPagamento NovoStatus,
        CancellationToken ct)
    {
        try
        {
            await _mediator.Send(new UpdateStatusPedidoParcelaCommand(InformacoesPagamentoId, ParcelaId, NovoStatus), ct);
            return StatusCode(204);
        }
        catch
        {
            return BadRequest();
        }
    }
}