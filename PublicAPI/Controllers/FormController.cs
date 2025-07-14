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
    public class FormController : ControllerBase
    {
        private readonly IFormService _formService;
        public FormController(IFormService formService)
        {
           this._formService = formService;
        }

        [Authorize]
        [HttpGet("{courseId}/forms")]
        public async Task<IActionResult> GetForms(int courseId)
        {
            var (success, errors, coursedtos) = await _formService.GetForms(courseId);
            if (!success)
            {
                return BadRequest(errors);
            }

            return Ok(coursedtos);
        }
        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetForm(int id)
        {
            var (success, errors, FormDTO) = await _formService.GetFormByIdAsync(id);
            if (!success)
            {
                return BadRequest(errors);
            }
            return Ok(FormDTO);
        }

        [Authorize]
        [HttpPost("create-form")]
        public async Task<IActionResult> CreateForm([FromBody] FormDTO formdto)
        {
           var (success, errors, id) = await _formService.CreateFormAsync(formdto);

            if (!success)
            {
                return BadRequest(new
                {
                    Success = false,
                    Errors = errors
                });
            }

            return CreatedAtAction(nameof(GetForm), new { id = formdto.Id }, new
            {
                Success = true,
                Message = "Form created successfully."
            });
        }

        [HttpPut("{id}")]
        public async  Task<IActionResult> UpdateForm([FromBody] FormDTO formdto)
        {
            var userId = User.FindFirst(Claims.NameIdentifier)?.Value;
            if (userId == null) { return BadRequest(); }
            var (success, errors) = await _formService.UpdateFormAsync(formdto, userId);
            if (!success)
            {
                return BadRequest(errors);
            }
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteForm(int id)
        {
            var userId = User.FindFirst(Claims.NameIdentifier)?.Value;
            var (success, error) =  await _formService.DeleteFormAsync(id, userId);

            if (!success)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
