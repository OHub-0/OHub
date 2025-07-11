using PublicAPI.Data;
using PublicAPI.DTO;
using PublicAPI.Model;
using PublicAPI.Services.Interfaces;

namespace PublicAPI.Services
{
    public class CourseService: ICourseService
    {
        private readonly ApplicationDbContext _context;

        public CourseService(ApplicationDbContext context)
        {
            this._context = context;
        }
        public async Task<(bool Success, List<string>? Errors, int? courseId)> CreateCourseAsync(CourseDTO courseDto, string adminId)
        {
            var institution = await _context.Institutions.FindAsync(courseDto.InstitutionId);
            if (institution == null)
            {

               return (false, new List<string> { "Institution with given Id doesn't exist" }, null);
            }
            if (adminId != institution.AdminId)
            {
                return (false, new List<string> { "User is not authorized" }, null);
            }
            var course = new Course
            {
                Title = courseDto.Title,
                Description = courseDto.Description,
                InstitutionId = courseDto.InstitutionId
            };

            _context.Courses.Add(course);
            await _context.SaveChangesAsync();

            return (true, null, course.Id);

        }

        public async Task<(bool Success, List<string>? Errors, CourseDTO coursedto)> GetCourseByIdAsync(int id)
        {
            var course = await _context.Courses.FindAsync(id);
            if (course == null)
            {
                return (false, new List<string> { "Course not found" }, null);
            }
            return (true, null, course.ToDto());
        }

        public  async Task<(bool Success, List<string>? Errors)> DeleteCourse(int id, string adminId)
        {
            var course = await _context.Courses.FindAsync(id);
            if (course == null)
            {
                return (false, new List<string> { "Course not found" });
            }
            var institution = await _context.Institutions.FindAsync(course.InstitutionId);
            if (institution == null || institution.AdminId != adminId)
            {
                return (false, new List<string> { "User is not authorized to delete this course" });
            }

            _context.Courses.Remove(course);
            await _context.SaveChangesAsync();

            return (true, null);
        }

        public async Task<(bool Success, List<string>? Errors)> UpdateCourse(CourseDTO courseDto, string adminId)
        {
            var institution = await _context.Institutions.FindAsync(courseDto.InstitutionId);
            var course = await _context.Courses.FindAsync(courseDto.Id);
            if (course == null || institution == null)
            {
                return (false, new List<string> { "Course or Institution not found" });
            }
            if (institution.AdminId != adminId)
            {
                return (false, new List<string> { "User is not authorized to update this course" });
            }
            course.UpdateFromDto(courseDto);
            await _context.SaveChangesAsync();
            return (true, null);
        }

        public async Task<(bool Success, List<string>? Errors, IEnumerable<CourseDTO>? courses)> GetAllCoursesByInstitutionId(int institutionId)
        {
            var courses = _context.Courses.Where(c => c.InstitutionId == institutionId).ToList();
            var coursesDto = courses.Select(c => c.ToDto()).ToList();
            if (courses == null)
            {
                return (false, new List<string> { "No courses found for this institution" }, null);
            }
            return (true, null, coursesDto);

        }
    }
}
