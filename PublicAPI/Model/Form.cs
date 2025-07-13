using PublicAPI.Services.Interfaces;
using System.ComponentModel.DataAnnotations.Schema;

namespace PublicAPI.Model
{
    public class Form
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string Description { get; set; } = null!;
        public int CourseId { get; set; }
        public Course Course { get; set; } = null!;

        public ICollection<FollowForm>? Followers { get; set; }

        public DateTime CreatedDate { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public DateTime OpenFrom { get; set; }
        public DateTime? OpenUntil { get; set; }

    }
}
