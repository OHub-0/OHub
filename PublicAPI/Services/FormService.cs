using PublicAPI.Data;
using PublicAPI.Model;
using PublicAPI.DTO;   

namespace PublicAPI.Services
{
    public class FormService
    {
        private readonly ApplicationDbContext _context;
        public FormService(ApplicationDbContext context)
        {
            _context = context;

        }

        public async Task<(bool Success, List<string>? Errors, int DbId)> CreateFormAsync(FormDTO formDto)
        {
            var course = await _context.Courses.FindAsync(formDto.CourseId);
            if (course == null)
            {
                return (false, new List<string> { "Course not found." }, 0);
            }
            var form = new Form
            {
                Title = formDto.Title,
                Description = formDto.Description,
                CourseId = formDto.CourseId,
                CreatedDate = DateTime.UtcNow,
                OpenFrom = formDto.OpenFrom,
                OpenUntil = formDto.OpenUntil
            };

            _context.Forms.Add(form);
            await _context.SaveChangesAsync();

            return (true, new List<string>(), form.Id);
        }
        public async Task<(bool Success, List<string>? Errors, FormDTO? Form)> GetFormByIdAsync(int id)
        {
            var form = await _context.Forms.FindAsync(id);
            if (form == null)
            {
                return (false, new List<string> { "Form not found." }, null);
            }
            return (true, new List<string>(), form.ToDto());
        }

        public async Task<(bool Success, List<string>? Errors)> DeleteFormAsync(int id, string userId)
        {
            var form = await _context.Forms.FindAsync(id);
            var course = form.Course;
            var institution = course.Institution;
            var adminId = institution.AdminId;

            if (form == null)
            {
                return (false, new List<string> { "Form doesn't exist" });
            }

            if (adminId == null || adminId != userId) {
                return (false, new List<string> { "User not authorized to perfrom this action" });
            }
            _context.Forms.Remove(form);
            await _context.SaveChangesAsync();
            return (true, null);
        }

        public async Task<(bool Success, List<string>? Errors)> UpdateFormAsync(FormDTO formdto, string userId)
        {
            var form = await _context.Forms.FindAsync(formdto.Id);
            if (form == null) { return (false, new List<string> { "Form doesn't exist" }); }

            var adminId = form.Course.Institution.AdminId;

            if (userId != adminId) { return (false, new List<string> { "User is not authorized" }); }

            form.UpdateFromDto(formdto);
            _context.Forms.Update(form);
            await _context.SaveChangesAsync();
            return (true, null);
        }

        public async Task<(bool Success, List<string>? Errors, IEnumerable<FormDTO> formdtos)> GetForms(int courseId)
        {
            var course = await _context.Courses.FindAsync(courseId);
            if (course == null) { return (false, new List<string> { "Course doesnt' exist" }, null); }
            var formdtos = _context.Forms.Where(f => f.CourseId == courseId).Select(f => f.ToDto());
            return (true, null, formdtos);
        }
    }
}
