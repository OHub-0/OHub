using PublicAPI.DTO;

namespace PublicAPI.Services.Interfaces
{
    public interface IFollowMapper
    {
        string FollowerId { get; set; } 
        int TargetId { get;}
        FollowTargetType TargetType { get;}
    }
}
