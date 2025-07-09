using PublicAPI.DTO;

namespace PublicAPI.Services.Interfaces
{
    public interface IAuthService
    {
        public Task<(bool Success, List<string>? Errors)> RegisterUserAsync(RegisterUserDTO registerUser, string role);
        public Task<(bool Success, List<string>? Errors, string? token, DateTime? expires)> LoginAsync(LoginUserDTO LoginUser);

        public Task<(bool Success, List<string>? Errors)>  ConfirmEmailAsync(string token, string email);
    }
}
