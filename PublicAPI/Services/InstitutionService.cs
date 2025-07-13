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
        public async Task<(bool Success, List<string>? Errors, int? dbId)> CreateInstitutionAsync(CreateInstitutionDTO institutiondto)
        {
            // check if user exists
            var user = await _userManager.FindByIdAsync(institutiondto.AdminId);
            if (user == null)
            {
                return (false, new List<string> { "User with given Id doesn't exist" }, null);
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

            return (true, null, institution.Id);
        }

        public async Task<(bool Success, List<string>? Errors, CreateInstitutionDTO? institutionDto)> GetInstitutionByIdAsync(int id)
        {
            var res = await _context.Institutions.FindAsync(id);
            if (res == null)
            {
                return (false, new List<string> { "Institution not found" }, null);
            }
            return (true, null, res.ToDto());
        }

        public async Task<(bool Success, List<string>? Errors)> DeleteInstitutionByIdAsync(int id, string adminId)
        { 
             var res = await _context.Institutions.FindAsync(id);
             if (res == null)
             {
                 return (false, new List<string> { "Institution not found" });
             }

             if (res.AdminId != adminId)
             {
                return (false, new List<string> { "You are not authorized to delete this institution" });
             }

             _context.Institutions.Remove(res);
             await _context.SaveChangesAsync();
             return (true, null);
        }

        public async Task<(bool Success, List<string>? Errors)> UpdateInstitutionAsync(CreateInstitutionDTO institutionDTO, string adminId)
        {
            var institution = await _context.Institutions.FindAsync(institutionDTO.Id);
            if (institution == null)
            {
                return (false, new List<string> { "Institution not found" });
            }

            if (institution.AdminId != adminId)
            {
                return (false, new List<string> { "You are not authorized to update this institution" });
            }

            institution.UpdateFromDto(institutionDTO);

            _context.Institutions.Update(institution);
            await _context.SaveChangesAsync();

            return (true, null);
        }
    }
}
