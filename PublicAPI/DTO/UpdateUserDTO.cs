using System.ComponentModel.DataAnnotations;

namespace PublicAPI.DTO
{
    public class UpdateUserDTO
    {
        public string Id { get; set; } = null!;
        public string? Email { get; set; }

        public string? PhoneNumber { get; set; }

        public string? UserName { get; set; }

        [MaxLength(100)]
        public string? FirstName { get; set; }

        [MaxLength(56)]
        public string? MiddleName { get; set; }

        [MaxLength(100)]
        public string? LastName { get; set; }

        public DateTime? DateofBirth { get; set; }

        public string? Address { get; set; }

        public string? City { get; set; }

        public string? State { get; set; }

        public string? Country { get; set; }
    }
}
