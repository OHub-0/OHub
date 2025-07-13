using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PublicAPI.DTO;
using PublicAPI.Services.Interfaces;
using Claims = System.Security.Claims.ClaimTypes;

namespace PublicAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FollowController : ControllerBase
    {
        private readonly IFollowService _followService;
        public FollowController(IFollowService followService)
        {
            _followService = followService;
        }

        [Authorize]
        [HttpPost("follow")]
        public async Task<IActionResult> AddFollower([FromBody] FollowDTO followdto)
        {
            var user = User.FindFirst(Claims.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(user))
            {
                return Unauthorized("User not authenticated.");
            }
            followdto.FollowerId = user;
            var (success, errors) = await _followService.AddFollowerAsync(followdto);

            if (!success)
            {
                return BadRequest(errors);
            }

            return Ok("Follow request successful.");
        }

        [Authorize]
        [HttpPost("unfollow")]
        public async Task<IActionResult> RemoveFollowerCourseAync([FromBody] FollowDTO followerDto)
        {
            var user = User.FindFirst(Claims.NameIdentifier)?.Value;

            var (success, errors) = await _followService.RemoveFollowAsync(followerDto);

            if (!success)
            {
                return BadRequest(errors);
            }

            return Ok("Unfollow request successful.");
        }

        [Authorize]
        [HttpGet("user/{userId}/follows")]
        public async Task<IActionResult> GetAllFollowsOfUserAsync(string userId)
        {
            var user = User.FindFirst(Claims.NameIdentifier)?.Value;
            if (user != userId) 
                return Unauthorized("You can only view your own follows.");
            var (success, errors, dtos) = await _followService.GetAllFollowsOfUserAsync(userId);
            if (!success)
            {
                return NotFound(errors);
            }

            return Ok(dtos);
        }
    }
}
