using System.ComponentModel.DataAnnotations.Schema;

namespace PublicAPI.Model
{
    public class Course
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }

        public int InstitutionId { get; set; }
        [ForeignKey(nameof(InstitutionId))]
        public Institution Institution { get; set; }

        public DateTime CreatedDate { get; set; }
        public DateTime ModifiedDate { get; set; }

    }
}
