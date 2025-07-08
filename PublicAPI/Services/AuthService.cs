using Microsoft.AspNetCore.Identity;
using PublicAPI.DTO;
using PublicAPI.Services.Interfaces;
using User.Management.Service.Models;
using User.Management.Service.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing.Tree;
using Microsoft.AspNetCore.Mvc.Routing;
using PublicAPI.Model.Authentication.Login;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Primitives;
using Microsoft.EntityFrameworkCore;
using PublicAPI.Model;

namespace PublicAPI.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<UserModel> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IEmailService _emailService;
        private readonly IUrlHelper _urlHelper;
        private readonly IConfiguration _configuration;
        public AuthService(UserManager<UserModel> userManager, RoleManager<IdentityRole> roleManager, IEmailService emailService, IUrlHelperFactory urlHelperFactory, IHttpContextAccessor httpContextAccessor, IConfiguration configuration)
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

        public async Task<(bool Success, List<string> Errors)> RegisterUserAsync(RegisterUserDTO registerUser, string role)
        {
            // check if user already existis
            var userExists = await _userManager.FindByEmailAsync(registerUser.Email);
            if (userExists != null)
            {
                return (false, new List<string> { "User already exists with this Email already exists." });
            }
            // check if role exists
            if (await _roleManager.RoleExistsAsync(role) == false)
            {
                return (false, new List<string> { "Role does not exist." });
            }

            // create user
            UserModel user = new()
            {
                Email = registerUser.Email,
                UserName = registerUser.Username,
                FirstName = registerUser.FirstName,
                LastName = registerUser.LastName,
                MiddleName = registerUser.MiddleName,
                PhoneNumber = registerUser.PhoneNumber,
                DateofBirth = registerUser.DateofBirth,
                Address = registerUser.Address,
                City = registerUser.City,
                State = registerUser.State,
                Country = registerUser.Country,
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

            // generate email confirmation token and confirmation token
            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            var confirmationLink = _urlHelper.Action("ConfirmEmail", "Authentication", new { token, email = user.Email }, "https");
            // send confirmation email
            var message = new Message(new string[] { user.Email }, "Confirm your email", $"Please confirm your account by clicking this link: <a href='{confirmationLink}'>link</a>");
            _emailService.SendEmail(message);

            return (true, new List<string>());
        }

        public async Task<(bool Success, List<string>? Errors, string? token, DateTime? expires)> LoginAsync(LoginUserDTO loginUser)
        {
            // check whether user exists
           
            var user = await _userManager.FindByEmailAsync(loginUser.Email);

            if (user != null && await _userManager.CheckPasswordAsync(user, loginUser.Password))
            {
                var authClaims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, user.UserName),
                    new Claim(ClaimTypes.NameIdentifier, user.Email),
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

        public async Task<(bool Success, List<string>? Errors)> ConfirmEmailAsync(string token, string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
            {
                return (false, new List<string> { "User does not exist." });
            }
            var result = await _userManager.ConfirmEmailAsync(user, token);
            if (result.Succeeded)
            {
                return (true, null);
            }
            else
            {
                var errors = result.Errors.Select(e => e.Description).ToList();
                return (false, errors);
            }
        }
        private JwtSecurityToken GenerateJwtToken(UserModel user, List<Claim> authClaims)
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


