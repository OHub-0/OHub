using PublicAPI.DTO;
using PublicAPI.Model;

namespace PublicAPI.Services.Interfaces
{
    public interface ICourseService
    {
        public Task<(bool Success, List<string>? Errors, int? courseId)> CreateCourseAsync(CourseDTO courseDto, string adminId);

        public Task<(bool Success, List<string>? Errors, CourseDTO coursedto)> GetCourseByIdAsync(int id);

        public Task<(bool Success, List<string>? Errors)> DeleteCourse(int id, string adminId);

        public Task<(bool Success, List<string>? Errors)> UpdateCourse(CourseDTO courseDto, string adminId);

        public Task<(bool Success, List<string>? Errors, IEnumerable<CourseDTO>? courses)> GetAllCoursesByInstitutionId(int institutionId);
    }
}
