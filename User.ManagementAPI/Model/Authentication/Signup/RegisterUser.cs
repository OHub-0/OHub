using System.ComponentModel.DataAnnotations;

namespace User.ManagementAPI.Model.Authentication.Signup
{
    public class RegisterUser
    {
        [Required(ErrorMessage = "User name is required")]
        public string? Username { get; set; }

        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }

        [Required(ErrorMessage = "Password is required")]
        public string? Password { get; set; }

    }
}
