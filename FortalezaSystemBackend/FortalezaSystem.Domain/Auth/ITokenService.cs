namespace FortalezaSystem.Domain.Auth;

public interface ITokenService
{
    string GenerateToken(string userId, string role, string name);
}
