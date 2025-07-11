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
            int count = 0;
            if (followDto.CourseId.HasValue) count++;
            if (followDto.FormId.HasValue) count++;
            if (followDto.InstitutionId.HasValue) count++;
            if (count != 1)
            {
                return (false, new List<string> { "Exactly one of CourseId, FormId, or InstitutionId must be provided." });
            }
            var FollowDTO = new follow
            {
                FollowerId = followDto.FollowerId,
                CourseId = followDto.CourseId,
                FormId = followDto.FormId,
                InstitutionId = followDto.InstitutionId,
            };
            _context.Follows.Add(FollowDTO);
            await _context.SaveChangesAsync();
            return (true, null);
        }
        public async Task<(bool success, List<string>? Errors)> RemoveFollowerCourseAsync(int courseId, string userId)
        {
            var followRecord = await _context.Follows.FirstOrDefaultAsync(f => f.FollowerId == userId && f.CourseId == courseId);
            if (followRecord == null)
            {
                return (false, new List<string> { "Follow record not found." });
            }
            _context.Follows.Remove(followRecord);
            await _context.SaveChangesAsync();
            return (true, null);

        }
        
        public async Task<(bool Success, List<string>? Errors, IEnumerable<FollowDTO>? dtos)> GetAllFollowsOfUserAsync(string userId)
        {
            var follows = await _context.Follows
                .Where(f => f.FollowerId == userId)
                .ToListAsync();

            if (follows == null || !follows.Any())
            {
                return (false, new List<string> { "No follows found for the user." }, null);
            }

            var followDtos = follows.Select(f => f.ToDto()).ToList();

            return (true, null, followDtos);
        }
    }
}
