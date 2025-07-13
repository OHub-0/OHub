using PublicAPI.DTO;
namespace PublicAPI.Services.Interfaces
{
    public interface IFollowService
    {
        Task<(bool Success, List<string>? Errors)> AddFollowerAsync(FollowDTO followDto);
        Task<(bool success, List<string>? Errors)> RemoveFollowAsync(FollowDTO follwDto);

        Task<(bool Success, List<string>? Errors, IEnumerable<FollowDTO>? dtos)> GetAllFollowsOfUserAsync(string userId);
    }
}
