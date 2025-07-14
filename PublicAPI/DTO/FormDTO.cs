namespace PublicAPI.DTO
{
    public class FormDTO
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string Description { get; set; } = null!;
        public int CourseId { get; set; }
        public DateTime OpenFrom { get; set; }
        public DateTime? OpenUntil { get; set; }

    }
}
