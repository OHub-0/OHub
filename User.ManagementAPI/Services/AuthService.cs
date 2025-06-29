using Microsoft.AspNetCore.Identity;
using User.ManagementAPI.Model.Authentication.Signup;
using User.ManagementAPI.Services.Interfaces;
using User.Management.Service.Models;
using User.Management.Service.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing.Tree;
using Microsoft.AspNetCore.Mvc.Routing;
using User.ManagementAPI.Model.Authentication.Login;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Primitives;
using Microsoft.EntityFrameworkCore;

namespace User.ManagementAPI.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IEmailService _emailService;
        private readonly IUrlHelper _urlHelper;
        private readonly IConfiguration _configuration;
        public AuthService(UserManager<IdentityUser> userManager, RoleManager<IdentityRole> roleManager, IEmailService emailService, IUrlHelperFactory urlHelperFactory, IHttpContextAccessor httpContextAccessor, IConfiguration configuration)
        {
            this._userManager = userManager;
            this._roleManager = roleManager;
            this._emailService = emailService;
            this._urlHelper = urlHelperFactory.GetUrlHelper(new ActionContext
            {
                HttpContext = httpContextAccessor.HttpContext,
                RouteData = httpContextAccessor.HttpContext?.GetRouteData(),
                ActionDescriptor = new Microsoft.AspNetCore.Mvc.Abstractions.ActionDescriptor()
            });
            this._configuration = configuration;
        }

        public async Task<(bool Success, List<string> Errors)> RegisterUserAsync(RegisterUser registerUser, string role)
        {
            // check if user already existis
            var userExists = await _userManager.Users.FirstOrDefaultAsync(u => u.PhoneNumber == registerUser.PhoneNumber);
            if (userExists != null)
            {
                return (false, new List<string> { "User already exists with this Number already exists." });
            }
            // check if role exists
            if (await _roleManager.RoleExistsAsync(role) == false)
            {
                return (false, new List<string> { "Role does not exist." });
            }

            // create user
            IdentityUser user = new()
            {
                PhoneNumber = registerUser.PhoneNumber,
                UserName = registerUser.Username,
            };
            var result = await _userManager.CreateAsync(user, registerUser.Password);

            // check if user creation was successful
            if (!result.Succeeded)
            {
                var errors = result.Errors.Select(e => e.Description).ToList();
                return (false, errors);
            }

            // add user to role
            await _userManager.AddToRoleAsync(user, role);
            return (true, new List<string>());
        }

        public async Task<(bool Success, List<string>? Errors, string? token, DateTime? expires)> LoginAsync(LoginModel loginUser)
        {
            // check whether user exists
           
            var user = await _userManager.Users.FirstOrDefaultAsync(u => u.PhoneNumber == loginUser.PhoneNumber);

            if (user != null && await _userManager.CheckPasswordAsync(user, loginUser.Password))
            {
                var authClaims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, user.UserName),
                    new Claim(ClaimTypes.NameIdentifier, user.PhoneNumber),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                };

                var userRoles = await _userManager.GetRolesAsync(user);
                foreach (var role in userRoles)
                {
                    authClaims.Add(new Claim(ClaimTypes.Role, role));
                }

                var jwtToken = GenerateJwtToken(user, authClaims);
                return (true, null, new JwtSecurityTokenHandler().WriteToken(jwtToken), jwtToken.ValidTo);
            }

            return (false, new List<string> { "User Does not exist" }, null, null);
        }
    
        private JwtSecurityToken GenerateJwtToken(IdentityUser user, List<Claim> authClaims)
        {
            var authSigningKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]));

            var token = new JwtSecurityToken(
                issuer: _configuration["JWT:ValidIssuer"],
                audience: _configuration["JWT:ValidAudience"],
                expires: DateTime.Now.AddHours(1),
                claims: authClaims,
                signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
            );

            return token;
        }

    }
}


