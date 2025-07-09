using PublicAPI.DTO;
using PublicAPI.Model;
namespace PublicAPI.Services.Interfaces
{
    public interface IInstitutionService
    {
        public Task<(bool Success, List<string>? Errors)> CreateInstitutionAsync(CreateInstitutionDTO institutionDto);

        public Task<(bool Success, List<string>? Errors, Institution institution)> GetInstitutionByIdAsync(int id);

        public Task<(bool Success, List<string>? Errors)> DeleteInstitutionByIdAsync(int id);

    }
}
