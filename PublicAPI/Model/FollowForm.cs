using PublicAPI.DTO;
using PublicAPI.Services.Interfaces;
using System.ComponentModel.DataAnnotations;

namespace PublicAPI.Model
{
    public class FollowForm : IAuditable, IFollowMapper
    {
        public int Id { get; set; }
        [Required]
        public string FollowerId { get; set; } = null!;
        [Required]
        public UserModel Follower { get; set; } = null!;


        public int FormId { get; set; }
        public Form Form { get; set; } = null!;

        public int TargetId => FormId;
        public FollowTargetType TargetType => FollowTargetType.Form;

        public DateTime CreatedDate { get; set; }
        public DateTime? ModifiedDate { get; set; }
    }
}
