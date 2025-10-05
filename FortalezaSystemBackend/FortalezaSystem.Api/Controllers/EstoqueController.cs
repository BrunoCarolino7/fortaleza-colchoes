using FortalezaSystem.Application.UseCases.Estoque.Commands.CreateEstoque;
using FortalezaSystem.Application.UseCases.Estoque.Dtos;
using FortalezaSystem.Application.UseCases.Estoque.Queries.GetAllEstoques;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace FortalezaSystem.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EstoqueController(IMediator mediator) : ControllerBase
{
    private readonly IMediator _mediator = mediator;

    [HttpGet]
    [ProducesResponseType(typeof(EstoqueAllDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> GetAll([FromQuery] GetAllEstoqueQuery query)
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpPost]
    [ProducesResponseType(typeof(EstoqueItemDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<EstoqueItemDto>> Criar([FromBody] CreateEstoqueCommand command, CancellationToken cancellationToken)
    {
        var result = await _mediator.Send(command, cancellationToken);

        if (result is null)
            return BadRequest("Não foi possível criar o estoque.");

        return Ok(result);
    }
}
