using FortalezaSystem.Application.UseCases.Auth;
using FortalezaSystem.Application.UseCases.Cliente.Commands.CreateCliente;
using FortalezaSystem.Application.UseCases.Cliente.Commands.DeleteCliente;
using FortalezaSystem.Application.UseCases.Cliente.Commands.UpdateCliente;
using FortalezaSystem.Application.UseCases.Cliente.Dtos;
using FortalezaSystem.Application.UseCases.Cliente.Queries.GetAllClientes;
using FortalezaSystem.Application.UseCases.Cliente.Queries.GetClienteById;
using FortalezaSystem.Application.UseCases.Cliente.Queries.GetNumberCustomers;
using FortalezaSystem.Infrastructure.Context;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FortalezaSystem.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ClienteController(IMediator mediator, AuthenticateUserUseCase authUseCase, DataContext dataContext) : ControllerBase
{
    private readonly IMediator _mediator = mediator;
    private readonly AuthenticateUserUseCase _authUseCase = authUseCase;
    private readonly DataContext _dataContext = dataContext;

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

    [HttpPost]
    public async Task<ActionResult<int>> Create([FromBody] CreateClienteCommand command, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(command, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { result.Id }, result.Id);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult> Update(int id, [FromBody] UpdateClienteCommand command, CancellationToken cancellationToken)
    {
        if (id != command.Id) return BadRequest("ID do cliente não corresponde ao payload");

        var success = await _mediator.Send(command, cancellationToken);
        if (!success) return NotFound();

        return NoContent();
    }

    [HttpPut("cadastrar")]
    public async Task<IActionResult> Update(string usuario, string senha, CancellationToken cancellationToken)
    {
        if (usuario is null || senha is null) return BadRequest("Usuário e/ou Senha inválidos");

        var fortUserExists = await _dataContext.FortalezaUser.FirstOrDefaultAsync(x => x.Id == 1);

        if (fortUserExists is null) return NotFound("Limite de usuários criados atingido!");

        if (fortUserExists.Status == true) return BadRequest("Usuário desativado");

        fortUserExists.Usuario = usuario;
        fortUserExists.SenhaHash = senha;
        fortUserExists.Status = true;

        _dataContext.FortalezaUser.Update(fortUserExists);
        await _dataContext.SaveChangesAsync();

        return Ok();
    }


    [HttpDelete("{id:int}")]
    public async Task<ActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        var success = await _mediator.Send(new DeleteClienteCommand(id), cancellationToken);
        if (!success) return NotFound();

        return NoContent();
    }
}
