using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PublicAPI.DTO;
using PublicAPI.Services.Interfaces;
using Claim = System.Security.Claims.ClaimTypes;

namespace PublicAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CourseController : ControllerBase
    {
        private readonly ICourseService _courseService;

        public CourseController(ICourseService courseService)
        {
            this._courseService = courseService;
        }


        [Authorize]
        [HttpPost("create-course")]
        public async Task<IActionResult> CreateCourse([FromBody] CourseDTO coursedto)
        {
            var userId = User.FindFirst(Claim.NameIdentifier)?.Value;
            var (success, errors, courseId) = await _courseService.CreateCourseAsync(coursedto, userId);
            
            if (!success) {
                return BadRequest(new
                {
                    Success = false,
                    Errors = errors
                });
            }

            return CreatedAtAction(nameof(GetCourse), new { id = courseId }, new
            {
                Success = true,
                Message = "Course created successfully.",
                CourseId = courseId
            });


        }

        [HttpGet("get-course/{id}")]
        public async Task<IActionResult> GetCourse(int id)
        {
            var (success, errors, course) = await _courseService.GetCourseByIdAsync(id);
            if (!success)
            {
                return NotFound(new
                {
                    Success = false,
                    Errors = errors
                });
            }

            return Ok(new
            {
                Success = true,
                Course = course
            });
        }

        [Authorize]
        [HttpPost("delete-course/{id}")]
        public async Task<IActionResult> DeleteCourse(int id)
        {
            var userId = User.FindFirst(Claim.NameIdentifier)?.Value;
            var (success, errors) = await _courseService.DeleteCourse(id, userId);
            if (!success)
            {
                return BadRequest(new
                {
                    Success = false,
                    Errors = errors
                });
            }

            return Ok(new
            {
                Success = true,
                Message = "Course deleted successfully."
            });
        }

        [Authorize]
        [HttpPost("update-course")]
        public async Task<IActionResult> UpdateCourse([FromBody] CourseDTO coursedto)
        {
            var userId = User.FindFirst(Claim.NameIdentifier)?.Value;
            var (success, errors) = await _courseService.UpdateCourse(coursedto, userId);
            if (!success)
            {
                return BadRequest(new
                {
                    Success = false,
                    Errors = errors
                });
            }

            return Ok(new
            {
                Success = true,
                Message = "Course updated successfully."
            });
        }
    }
}
