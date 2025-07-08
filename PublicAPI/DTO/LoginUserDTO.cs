using System.ComponentModel.DataAnnotations;

namespace PublicAPI.DTO
{
    public class LoginUserDTO
    {
        public string? Username { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Email { get; set; }

        [Required(ErrorMessage = "Password is required.")]
        public string? Password { get; set; }
    }
}
