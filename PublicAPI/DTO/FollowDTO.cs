using PublicAPI.Services.Interfaces;

namespace PublicAPI.DTO
{
    public class FollowDTO
    {
        public string FollowerId { get; set; }
        public FollowTargetType TargetType { get; set; }
        public byte TargetId { get; set; }

    }

    public enum FollowTargetType
    {
        Institution = 0,
        Course = 1,
        Form = 2
    }
}
