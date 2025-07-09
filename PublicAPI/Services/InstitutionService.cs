using Microsoft.AspNetCore.Identity;
using PublicAPI.DTO;
using PublicAPI.Services.Interfaces;
using PublicAPI.Model;
using PublicAPI.Data;
using Microsoft.EntityFrameworkCore;

namespace PublicAPI.Services
{
    public class InstitutionService : IInstitutionService
    {
        private readonly UserManager<UserModel> _userManager;
        private readonly ApplicationDbContext _context;
        public InstitutionService(UserManager<UserModel> userManager, ApplicationDbContext context)
        {
            this._userManager = userManager;
            _context = context;
        }
        public async Task<(bool Success, List<string>? Errors)> CreateInstitutionAsync(CreateInstitutionDTO institutiondto)
        {
            // check if user exists
            var user = await _userManager.FindByIdAsync(institutiondto.AdminId);
            if (user == null)
            {
                return (false, new List<string> { "User with given Id doesn't exist" });
            }

            var institution = new Institution
            {
                AdminId = institutiondto.AdminId,
                Admin = user,
                Name = institutiondto.Name,
                Description = institutiondto.Description,
                PrimaryEmail = institutiondto.PrimaryEmail,
                SecondaryEmail = institutiondto.SecondaryEmail,
                PrimaryPhone = institutiondto.PrimaryPhone,
                Country = institutiondto.Country,
                State = institutiondto.State,
                City = institutiondto.City,
                Type = institutiondto.Type,
            };
            _context.Institutions.Add(institution);
            await _context.SaveChangesAsync();

            return (true, null);
        }

        public async Task<(bool Success, List<string>? Errors, Institution? institution)> GetInstitutionByIdAsync(int id)
        {
            var res = await _context.Institutions.FindAsync(id);
            if (res == null)
            {
                return (false, new List<string> { "Institution not found" }, null);
            }
            return (true, null, res);
        }

        public async Task<(bool Success, List<string>? Errors)> DeleteInstitutionByIdAsync(int id)
        {
             var res = await _context.Institutions.FindAsync(id);
             if (res == null)
             {
                 return (false, new List<string> { "Institution not found" });
             }
             _context.Institutions.Remove(res);
            await _context.SaveChangesAsync();
            return (true, null);
        }
    }
}
