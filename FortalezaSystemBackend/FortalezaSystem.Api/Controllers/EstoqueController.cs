using FortalezaSystem.Application.UseCases.Estoque.Commands.CreateEstoque;
using FortalezaSystem.Application.UseCases.Estoque.Dtos;
using FortalezaSystem.Application.UseCases.Estoque.Queries.GetAllEstoques;
using FortalezaSystem.Infrastructure.Context;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FortalezaSystem.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EstoqueController(IMediator mediator, DataContext context) : ControllerBase
{
    private readonly IMediator _mediator = mediator;
    private readonly DataContext _context = context;

    [HttpGet]
    [ProducesResponseType(typeof(EstoqueAllDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> GetAll([FromQuery] GetAllEstoqueQuery query)
    {
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("produto/{id:int}")]
    [ProducesResponseType(typeof(EstoqueItemDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(int id, CancellationToken ct)
    {
        var produto = await _context.Estoque
            .AsNoTracking()
            .FirstOrDefaultAsync(e => e.Id == id, ct);

        if (produto == null)
            return NotFound(new { message = $"Produto com ID {id} não encontrado." });

        var dto = new EstoqueItemDto
        {
            Id = produto.Id,
            Nome = produto.Nome,
            Categoria = produto.Categoria,
            Tamanho = produto.Tamanho,
            Preco = produto.Preco,
            Quantidade = produto.Quantidade,
            StatusEstoque = produto.StatusEstoque
        };

        return Ok(dto);
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

    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(EstoqueItemDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Atualizar(int id, [FromBody] EstoqueItemDto dto, CancellationToken ct)
    {
        var produto = await _context.Estoque.FirstOrDefaultAsync(e => e.Id == id, ct);
        if (produto == null)
            return NotFound(new { message = $"Produto com ID {id} não encontrado." });

        produto.Atualizar(
            dto.Nome,
            dto.Categoria,
            dto.Tamanho,
            dto.Preco,
            dto.Quantidade,
            dto.StatusEstoque
        );

        await _context.SaveChangesAsync(ct);

        var atualizado = new EstoqueItemDto
        {
            Id = produto.Id,
            Nome = produto.Nome,
            Categoria = produto.Categoria,
            Tamanho = produto.Tamanho,
            Preco = produto.Preco,
            Quantidade = produto.Quantidade,
            StatusEstoque = produto.StatusEstoque
        };

        return Ok(atualizado);
    }

    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Remover(int id, CancellationToken ct)
    {
        var produto = await _context.Estoque.FirstOrDefaultAsync(e => e.Id == id, ct);
        if (produto == null)
            return NotFound(new { message = $"Produto com ID {id} não encontrado." });
        produto.Status = false;

        _context.Estoque.Update(produto);
        await _context.SaveChangesAsync(ct);

        return NoContent();
    }
}
