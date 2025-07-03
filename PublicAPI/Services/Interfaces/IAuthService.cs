using PublicAPI.Model.Authentication.Login;
using PublicAPI.Model.Authentication.Signup;

namespace PublicAPI.Services.Interfaces
{
    public interface IAuthService
    {
        public Task<(bool Success, List<string>? Errors)> RegisterUserAsync(RegisterUser registerUser, string role);
        public Task<(bool Success, List<string>? Errors, string? token, DateTime? expires)> LoginAsync(LoginModel LoginUser);

        public Task<(bool Success, List<string>? Errors)>  ConfirmEmailAsync(string token, string email);
    }
}
