using FortalezaSystem.Domain.Auth;
using FortalezaSystem.Domain.Repository;

namespace FortalezaSystem.Application.UseCases.Auth;

public class AuthenticateUserUseCase(ITokenService tokenService, IFortalezaUserRepository fortalezaUserRepository)
{
    private readonly ITokenService _tokenService = tokenService;
    private readonly IFortalezaUserRepository _fortalezaUserRepository = fortalezaUserRepository;

    public async Task<string> Execute(string usuario, string password)
    {
        var cliente = await _fortalezaUserRepository.ObterUsuario(usuario, password);
        var name = "";
        var id = "";
        var role = "";

        if (cliente is null)
            throw new UnauthorizedAccessException("Usuario nao autorizado");

        id = cliente.Cliente.Id.ToString();
        name = cliente.Cliente.Nome;
        role = "admin";
        //email = cliente.Result.Cliente.;


        return _tokenService.GenerateToken(id, role, name);
    }
}
