using PublicAPI.Services.Interfaces;
using System.ComponentModel.DataAnnotations.Schema;

namespace PublicAPI.Model
{
    public class follow: IAuditable
    {
        public int Id { get; set; }
        public string FollowerId { get; set; }

        [ForeignKey(nameof(FollowerId))]
        public UserModel Follower { get; set; }

        
        public int CourseId { get; set; }
        [ForeignKey(nameof(CourseId))]
        public Course course { get; set; }
        public int FormId { get; set; }
        [ForeignKey(nameof(FormId))]
        public Form form { get; set; }

        public int InstitutionId { get; set; }
        [ForeignKey(nameof(InstitutionId))]
        public Institution Institution { get; set; }

        public DateTime CreatedDate { get; set; }
        public DateTime? ModifiedDate { get; set; }

        public string? note { get; set; }

    }
}
