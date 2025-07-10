using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PublicAPI.DTO;
using PublicAPI.Services.Interfaces;
using Claim = System.Security.Claims.ClaimTypes;



namespace PublicAPI.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class InstitutionController : ControllerBase
    {
        private readonly IInstitutionService _institutionService;

        public InstitutionController(IInstitutionService institutionService)
        {
            _institutionService = institutionService;
        }
        [Authorize]
        [HttpPost("create-institution")]
        public async Task<IActionResult> CreateInstitution([FromBody] CreateInstitutionDTO institutiondto)
        {
            if (string.IsNullOrWhiteSpace(institutiondto.AdminId))
            {
                string userId = User.FindFirst(Claim.NameIdentifier)?.Value;
                institutiondto.AdminId = userId;
            }
            var (success, errors) = await _institutionService.CreateInstitutionAsync(institutiondto);

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
                Message = "Institution created successfully."
            });
        }


        [HttpGet("get-institution/{id}")]
        public async Task<IActionResult> GetInstitution(int id)
        {
            var (success, errors, institution) = await _institutionService.GetInstitutionByIdAsync(id);
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
                Institution = institution
            });
        }

        [Authorize]
        [HttpPost("delete-institution/{id}")]
        public async Task<IActionResult> DeleteInstitution(int id)
        {
            var adminId = User.FindFirst(Claim.NameIdentifier)?.Value;
            if (string.IsNullOrWhiteSpace(adminId))
            {
                return Unauthorized(new
                {
                    Success = false,
                    Errors = new List<string> { "User is not authorized." }
                });
            }

            var (success, errors) = await _institutionService.DeleteInstitutionByIdAsync(id, adminId);
            if (!success)
            {
                return BadRequest(new
                {
                    Success = false,
                    Errors = errors
                });
            }
            return NoContent();
        }

        public async Task<IActionResult> UpdateInstitution([FromBody] CreateInstitutionDTO institutiondto)
        {
            if (string.IsNullOrWhiteSpace(institutiondto.AdminId))
            {
                return BadRequest(new
                {
                    Success = false,
                    Errors = new List<string> { "AdminId is required." }
                });
            }
            var (success, errors) = await _institutionService.UpdateInstitutionAsync(institutiondto);
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
                Message = "Institution updated successfully."
            });
        } 
    }
}
