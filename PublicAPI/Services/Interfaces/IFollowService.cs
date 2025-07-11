using PublicAPI.DTO;
namespace PublicAPI.Services.Interfaces
{
    public interface IFollowService
    {
        Task<(bool Success, List<string>? Errors)> AddFollowerAsync(FollowDTO followDto);
        Task<(bool success, List<string>? Errors)> RemoveFollowerCourseAsync(int courseId, string userId);

        Task<(bool Success, List<string>? Errors, IEnumerable<FollowDTO> dtos)> GetAllFollowsOfUserAsync(string userId);
        /*Task<IEnumerable<FollowDTO>> GetFollowersByCourseIdAsync(int courseId);
        Task<IEnumerable<FollowDTO>> GetFollowersByFormIdAsync(int formId);
        Task<IEnumerable<FollowDTO>> GetFollowersByInstitutionIdAsync(int institutionId);
        Task<IEnumerable<FollowDTO>> GetAllFollowersAsync();*/
    }
}
