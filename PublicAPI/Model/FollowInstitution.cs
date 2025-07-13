using PublicAPI.DTO;
using PublicAPI.Services.Interfaces;

namespace PublicAPI.Model
{
    public class FollowInstitution: IAuditable, IFollowMapper
    {
        public int Id { get; set; }
        public string FollowerId { get; set; } = null!;
        public UserModel Follower { get; set; } = null!;
        public int InstitutionId { get; set; }
        public Institution Institution { get; set; } = null!;

        public int TargetId => InstitutionId;
        public FollowTargetType TargetType => FollowTargetType.Institution;

        public DateTime CreatedDate { get; set; }
        public DateTime? ModifiedDate { get; set; }
    }
}
