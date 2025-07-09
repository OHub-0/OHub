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

        [HttpGet("delete-institution/{id}")]
        public async Task<IActionResult> DeleteInstitution(int id)
        {
            var (success, errors) = await _institutionService.DeleteInstitutionByIdAsync(id);
            if (!success)
            {
                return NotFound(new
                {
                    Success = false,
                    Errors = errors
                });
            }
            return NoContent();
        }
    }
}
