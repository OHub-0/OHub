using PublicAPI.DTO;
using PublicAPI.Data;
using PublicAPI.Model;
using PublicAPI.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace PublicAPI.Services
{
    public class FollowService: IFollowService
    {
        private readonly ApplicationDbContext _context;

        public FollowService(ApplicationDbContext context)
        {
            _context = context;
        }

       

        public async Task<(bool Success, List<string>? Errors)> AddFollowerAsync(FollowDTO followDto)
        {
            switch (followDto.TargetType)
            {
                case FollowTargetType.Institution:
                    var followInstitution = new FollowInstitution
                    {
                        FollowerId = followDto.FollowerId,
                        InstitutionId = followDto.TargetId
                    };
                    _context.FollowInstitutions.Add(followInstitution);
                    break;
                case FollowTargetType.Course:
                    var followCourse = new FollowCourse
                    {
                        FollowerId = followDto.FollowerId,
                        CourseId = followDto.TargetId
                    };
                    _context.FollowCourses.Add(followCourse);
                    break;
                case FollowTargetType.Form:
                    var followForm = new FollowForm
                    {
                        FollowerId = followDto.FollowerId,
                        FormId = followDto.TargetId
                    };
                    _context.FollowForms.Add(followForm);
                    break;
                default:
                    return (false, new List<string> { "Invalid target type." });
            }
            await _context.SaveChangesAsync();
            return (true, null);
        }
        public async Task<(bool success, List<string>? Errors)> RemoveFollowAsync(FollowDTO followerDto)
        {
            switch (followerDto.TargetType)
            {
                case FollowTargetType.Institution:
                    var followInstitution = await _context.FollowInstitutions
                        .FirstOrDefaultAsync(f => f.FollowerId == followerDto.FollowerId && f.InstitutionId == followerDto.TargetId);
                    if (followInstitution == null)
                    {
                        return (false, new List<string> { "Follow record not found." });
                    }
                    _context.FollowInstitutions.Remove(followInstitution);
                    break;
                case FollowTargetType.Course:
                    var followCourse = await _context.FollowCourses
                        .FirstOrDefaultAsync(f => f.FollowerId == followerDto.FollowerId && f.CourseId == followerDto.TargetId);
                    if (followCourse == null)
                    {
                        return (false, new List<string> { "Follow record not found." });
                    }
                    _context.FollowCourses.Remove(followCourse);
                    break;
                case FollowTargetType.Form:
                    var followForm = await _context.FollowForms
                        .FirstOrDefaultAsync(f => f.FollowerId == followerDto.FollowerId && f.FormId == followerDto.TargetId);
                    if (followForm == null)
                    {
                        return (false, new List<string> { "Follow record not found." });
                    }
                    _context.FollowForms.Remove(followForm);
                    break;
                default:
                    return (false, new List<string> { "Invalid target type." });
            }
            
            await _context.SaveChangesAsync();
            return (true, null);

        }
        
        public async Task<(bool Success, List<string>? Errors, IEnumerable<FollowDTO>? dtos)> GetAllFollowsOfUserAsync(string userId)
        {
            var courses = await _context.FollowCourses
                .Where(f => f.FollowerId == userId)
                .ToListAsync();
            var institutions = await _context.FollowInstitutions
                .Where(f => f.FollowerId == userId)
                .ToListAsync();
            var forms = await _context.FollowForms
                .Where(f => f.FollowerId == userId)
                .ToListAsync();

            var courseDtos = courses.Select(f => f.ToDto());
            
            var institutionDtos = institutions.Select(f => f.ToDto());

            var formDtos = forms.Select(f => f.ToDto());

            var data = courseDtos
                .Concat(institutionDtos)
                .Concat(formDtos)
                .ToList();

            return (true, null, data);
        }
    }
}
