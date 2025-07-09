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
        public string Name { get; set; }

        [Required]
        public string Description { get; set; }

        public UserModel Admin { get; set; }

        [ForeignKey(nameof(Admin))]
        public string AdminId { get; set; }

        public string? SecondaryEmail { get; set; }
        public string Country { get; set; }
        public string State { get; set; }
        public string City { get; set; }

        public string Type { get; set; }
        public string PrimaryEmail { get; set; }
        public string? PrimaryPhone { get; set; }

        public DateTime CreatedDate { get; set; }
        public DateTime? ModifiedDate { get; set; }

        public ICollection<Course> Courses { get; set; }
        public ICollection<Form> Forms { get; set; }
        public ICollection<follow> Followers { get; set; }

    }
}
