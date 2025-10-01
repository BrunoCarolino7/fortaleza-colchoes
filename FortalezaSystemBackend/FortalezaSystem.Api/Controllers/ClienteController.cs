using FortalezaSystem.Application.UseCases.Cliente.Commands.CreateCliente;
using FortalezaSystem.Application.UseCases.Cliente.Commands.DeleteCliente;
using FortalezaSystem.Application.UseCases.Cliente.Commands.UpdateCliente;
using FortalezaSystem.Application.UseCases.Cliente.Queries.GetAllClientes;
using FortalezaSystem.Application.UseCases.Cliente.Queries.GetClienteById;
using FortalezaSystem.Domain.Dtos;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace FortalezaSystem.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ClienteController(IMediator mediator) : ControllerBase
{
    private readonly IMediator _mediator = mediator;

    // 🔹 GET: api/cliente
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ClienteDto>>> GetAll(CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetAllClientesQuery(), cancellationToken);
        return Ok(result);
    }

    // 🔹 GET: api/cliente/{id}
    [HttpGet("{id:int}")]
    public async Task<ActionResult<ClienteDto>> GetById(int id, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetClienteByIdQuery(id), cancellationToken);
        if (result == null) return NotFound();
        return Ok(result);
    }

    // 🔹 POST: api/cliente
    [HttpPost]
    public async Task<ActionResult<Guid>> Create([FromBody] CreateClienteCommand command, CancellationToken cancellationToken)
    {
        var id = await _mediator.Send(command, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id }, id);
    }

    // 🔹 PUT: api/cliente/{id}
    [HttpPut("{id:int}")]
    public async Task<ActionResult> Update(int id, [FromBody] UpdateClienteCommand command, CancellationToken cancellationToken)
    {
        if (id != command.Id) return BadRequest("ID do cliente não corresponde ao payload");

        var success = await _mediator.Send(command, cancellationToken);
        if (!success) return NotFound();

        return NoContent();
    }

    // 🔹 DELETE: api/cliente/{id}
    [HttpDelete("{id:int}")]
    public async Task<ActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var success = await _mediator.Send(new DeleteClienteCommand(id), cancellationToken);
        if (!success) return NotFound();

        return NoContent();
    }
}
