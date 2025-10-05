using FortalezaSystem.Application.UseCases.Auth;
using FortalezaSystem.Application.UseCases.Cliente.Commands.CreateCliente;
using FortalezaSystem.Application.UseCases.Cliente.Commands.DeleteCliente;
using FortalezaSystem.Application.UseCases.Cliente.Commands.UpdateCliente;
using FortalezaSystem.Application.UseCases.Cliente.Dtos;
using FortalezaSystem.Application.UseCases.Cliente.Queries.GetAllClientes;
using FortalezaSystem.Application.UseCases.Cliente.Queries.GetClienteById;
using FortalezaSystem.Application.UseCases.Cliente.Queries.GetNumberCustomers;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace FortalezaSystem.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ClienteController(IMediator mediator, AuthenticateUserUseCase authUseCase) : ControllerBase
{
    private readonly IMediator _mediator = mediator;
    private readonly AuthenticateUserUseCase _authUseCase = authUseCase;

    // 🔹 GET: api/cliente
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        CancellationToken cancellationToken = default)
    {
        var query = new GetAllClientesQuery(page, pageSize);
        var result = await _mediator.Send(query, cancellationToken);

        if (result == null)
            return NotFound("Nenhum cliente encontrado.");

        return Ok(result);
    }

    [HttpGet("count")]
    public async Task<ActionResult<IEnumerable<ClienteDto>>> GetNumberCustomers(CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetNumberCustomersQuery(), cancellationToken);

        return result == 0
            ? (ActionResult<IEnumerable<ClienteDto>>)NotFound("Nenhum cliente encontrado.")
            : (ActionResult<IEnumerable<ClienteDto>>)Ok(result);
    }


    // 🔹 GET: api/cliente/{id}
    [HttpGet("{id:int}")]
    public async Task<ActionResult<ClienteDto>> GetById(int id, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(new GetClienteByIdQuery(id), cancellationToken);
        if (result == null) return NotFound();
        return Ok(result);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginCommand command)
    {
        var token = await _authUseCase.Execute(command.User, command.Password);
        return Ok(new { Token = token, Status = 200 });
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
