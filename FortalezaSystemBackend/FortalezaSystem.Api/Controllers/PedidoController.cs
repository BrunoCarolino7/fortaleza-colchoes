using FortalezaSystem.Application.UseCases.Pedidos.Queries.GetAllPedido;
using FortalezaSystem.Application.UseCases.Pedidos.Queries.GetPedidoByClienteId;
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
}