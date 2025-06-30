using User.ManagementAPI.Model.Authentication.Login;
using User.ManagementAPI.Model.Authentication.Signup;

namespace User.ManagementAPI.Services.Interfaces
{
    public interface IAuthService
    {
        public Task<(bool Success, List<string>? Errors)> RegisterUserAsync(RegisterUser registerUser, string role);
        public Task<(bool Success, List<string>? Errors, string? token, DateTime? expires)> LoginAsync(LoginModel LoginUser);

        public Task<(bool Success, List<string>? Errors)>  ConfirmEmailAsync(string token, string email);
    }
}
