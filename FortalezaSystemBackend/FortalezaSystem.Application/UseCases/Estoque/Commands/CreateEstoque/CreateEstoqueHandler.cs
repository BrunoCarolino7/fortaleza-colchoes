using FortalezaSystem.Application.UseCases.Estoque.Dtos;
using FortalezaSystem.Domain.Repository;
using MediatR;

using EstoqueEntity = FortalezaSystem.Domain.Entities.Estoque;

namespace FortalezaSystem.Application.UseCases.Estoque.Commands.CreateEstoque;

public class CreateEstoqueHandler(IEstoqueRepository estoqueRepository) : IRequestHandler<CreateEstoqueCommand, EstoqueItemDto>
{
    private readonly IEstoqueRepository _estoqueRepository = estoqueRepository;

    public async Task<EstoqueItemDto> Handle(CreateEstoqueCommand request, CancellationToken cancellationToken)
    {
        var estoque = EstoqueEntity.Criar(
            request.Nome,
            request.Categoria,
            request.Tamanho,
            request.Preco,
            request.Quantidade
        );

        var estoqueSalvo = await _estoqueRepository.CriarEstoque(estoque);

        var estoqueDto = EstoqueItemDto.ConvertToDto(estoqueSalvo);

        return estoqueDto;
    }
}
