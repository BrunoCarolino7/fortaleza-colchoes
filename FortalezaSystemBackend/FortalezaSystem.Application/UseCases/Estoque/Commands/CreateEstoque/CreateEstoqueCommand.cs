using FortalezaSystem.Application.UseCases.Estoque.Dtos;
using MediatR;

namespace FortalezaSystem.Application.UseCases.Estoque.Commands.CreateEstoque;

public record CreateEstoqueCommand(
    string Nome,
    string Categoria,
    string Tamanho,
    decimal Preco,
    int Quantidade) : IRequest<EstoqueItemDto>
{ }