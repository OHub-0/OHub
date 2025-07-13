using PublicAPI.Services.Interfaces;
using System.ComponentModel.DataAnnotations.Schema;

namespace PublicAPI.Model
{
    public class Course: IAuditable
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }

        public int InstitutionId { get; set; }
        [ForeignKey(nameof(InstitutionId))]
        public Institution Institution { get; set; }

        public ICollection<Form>? Forms { get; set; }
        public ICollection<FollowCourse>? Followers { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? ModifiedDate { get; set; }

    }
}
