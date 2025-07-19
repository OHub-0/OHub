using Microsoft.AspNetCore.Identity;
using PublicAPI.DTO;

namespace PublicAPI.Services.Interfaces
{
    public interface IAuthService
    {
        public Task<(bool Success, List<string>? Errors)> RegisterUserAsync(RegisterUserDTO registerUser, string role);
        public Task<(bool Success, List<string>? Errors, string? token, DateTime? expires)> LoginAsync(LoginUserDTO LoginUser);

        public Task<(bool Success, List<string>? Errors)>  ConfirmEmailAsync(string token, string email);

        public Task<(bool Success, IEnumerable<IdentityError>? Errors)> DeleteUserAsync(string userId);

        public Task<(bool Success, IEnumerable<IdentityError>? Errors)> UpdateUserAsync(UpdateUserDTO UpdateUser);
    }
}
