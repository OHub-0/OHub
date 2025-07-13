using PublicAPI.DTO;
using PublicAPI.Services.Interfaces;

namespace PublicAPI.Model
{
    public class FollowCourse: IAuditable, IFollowMapper 
    {
        public int Id { get; set; }
        public string FollowerId { get; set; } = null!;
        public UserModel Follower { get; set; } = null!;
        public int CourseId { get; set; }
        public Course Course { get; set; } = null!;

        public int TargetId => CourseId;
        public FollowTargetType TargetType => FollowTargetType.Course;
        public DateTime CreatedDate { get; set; }
        public DateTime? ModifiedDate { get; set; }

    }
}
