using System.ComponentModel.DataAnnotations.Schema;

namespace PublicAPI.Model
{
    public class Form
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }

 /*       public int? InstitutionId { get; set; }
        [ForeignKey(nameof(InstitutionId))]
        public Institution? Institution { get; set; }*/

        public int? CourseId { get; set; }
        [ForeignKey(nameof(CourseId))]
        public Course? Course { get; set; }

        public ICollection<follow> followers { get; set; }

        public DateTime CreatedDate { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public DateTime OpenFrom { get; set; }
        public DateTime OpenUntil { get; set; }

    }
}
