using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using User.ManagementAPI.Model.Authentication.Signup;
using User.Management.Service.Services;
using static System.Runtime.InteropServices.JavaScript.JSType;
using User.Management.Service.Models;
using User.ManagementAPI.Services.Interfaces;
using Microsoft.IdentityModel.Tokens;
using User.ManagementAPI.Model.Authentication.Login;

namespace User.ManagementAPI.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase {
        private readonly IEmailService _emailService;
        private readonly IAuthService _authService;
      

        public AuthenticationController(IAuthService authServic, IEmailService emailService)
        {   
            this._authService = authServic;
            this._emailService = emailService;
        }

        [HttpPost("register-user")]
        public async Task<IActionResult> RegisterUser([FromBody]RegisterUser registerUser, string role)
        {
            var (success, errors) = await _authService.RegisterUserAsync(registerUser, role);
            if (!success)
            {
                return Conflict(new
                {
                    Message = "Registration failed.",
                    Errors = errors
                });
            }
            return Ok(new { Message = "User Created Successfully" });

        }


        [HttpPost]
        [Route("login-user")]
        public async Task<IActionResult> LoginAsync([FromBody] LoginModel user)
        {
            var (success, errors, token, expires) = await _authService.LoginAsync(user);

            if (!success)
            {
                return Unauthorized(new
                {
                    Message = "Login failed.",
                    Errors = errors
                });
            }
            return Ok(new
            {
                Message = "Login successful.",
                Token = token
                
            });

        }

    }
}
