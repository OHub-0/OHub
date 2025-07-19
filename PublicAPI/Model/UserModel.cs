using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using PublicAPI.Services.Interfaces;
using System.ComponentModel.DataAnnotations.Schema;

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

        [NotMapped]
        public string FullName => string.Join(" ", new[] { FirstName, MiddleName, LastName }.Where(x => !string.IsNullOrWhiteSpace(x)));

        public DateTime? DateofBirth   { get; set; }
      
        public string? Address { get; set; }
  
        public string? City { get; set; }
        public string? State { get; set; }
        public string? Country { get; set; }

        public ICollection<Institution> InstitutionsAdministered { get; set; } = null!;
        public ICollection<FollowInstitution>? FollowingInstitutions { get; set; }
        public ICollection<FollowCourse>? FollowingCourses { get; set; }
        public ICollection<FollowForm>? FollowingForms { get; set; }

        public DateTime CreatedDate { get; set; }
        public DateTime? ModifiedDate { get; set; }

    }
}
