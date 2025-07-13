using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using PublicAPI.Services.Interfaces;

namespace PublicAPI.Model
{
    public class Institution : IAuditable
    {
        [Key]
        public int Id { get; set; }

        [Required, MaxLength(100)]
        public string Name { get; set; } = null!;

        [Required]
        public string Description { get; set; } = null!;

        public UserModel Admin { get; set; } = null!;

        [ForeignKey(nameof(Admin))]
        public string AdminId { get; set; } = null!;

        public string? SecondaryEmail { get; set; }
        public string Country { get; set; } = null!;
        public string State { get; set; } = null!;
        public string City { get; set; } = null!;

        public string Type { get; set; } = null!;
        public string PrimaryEmail { get; set; } = null!;
        public string? PrimaryPhone { get; set; }

        public DateTime CreatedDate { get; set; }
        public DateTime? ModifiedDate { get; set; }

        public ICollection<Course> Courses { get; set; } = null!;
        public ICollection<FollowInstitution> Followers { get; set; } = null!;

    }
}
