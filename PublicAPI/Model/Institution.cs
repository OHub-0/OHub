using System.ComponentModel.DataAnnotations;
using PublicAPI.Services.Interfaces;

namespace PublicAPI.Model
{
    public class Institution: IAuditable
    {
        [Required, MaxLength(100)]
        public string Name { get; set; }
        [Required]
        public string description { get; set; }
        public int creatorId { get; set; }

        public UserModel Creator { get; set; }

        public string? secondaryEmail { get; set; }

        public string country { get; set; }
        public string state { get; set; }

        public string city { get; set; }

        public DateTime CreatedDate { get; set; }
        public DateTime? ModifiedDate { get; set; }

    }
}
