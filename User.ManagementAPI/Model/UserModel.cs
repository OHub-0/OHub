using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace User.ManagementAPI.Model
{
    public class UserModel : IdentityUser
    {
        [Required, MaxLength(100)]  
        public string FirstName { get; set; }

        [Required, MaxLength(56)]
        public string MiddleName { get; set; }

        [Required, MaxLength(100)]
        public string? LastName { get; set; }

        public DateTime? DateofBirth   { get; set; }
      
        public string? Address { get; set; }
  
        public string? City { get; set; }
        public string? State { get; set; }
        public string? Country { get; set; }

    }
}
