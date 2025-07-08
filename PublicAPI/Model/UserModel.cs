using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using PublicAPI.Services.Interfaces;

namespace PublicAPI.Model
{
    public class UserModel : IdentityUser, IAuditable
    {
        [Required, MaxLength(100)]  
        public string? FirstName { get; set; }

        [Required, MaxLength(56)]
        public string? MiddleName { get; set; }

        [Required, MaxLength(100)]
        public string? LastName { get; set; }

        public DateTime? DateofBirth   { get; set; }
      
        public string? Address { get; set; }
  
        public string? City { get; set; }
        public string? State { get; set; }
        public string? Country { get; set; }

        public DateTime CreatedDate { get; set; }
        public DateTime? ModifiedDate { get; set; }

    }
}
