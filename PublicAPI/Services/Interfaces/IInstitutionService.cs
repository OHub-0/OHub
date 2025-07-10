using PublicAPI.DTO;
using PublicAPI.Model;
namespace PublicAPI.Services.Interfaces
{
    public interface IInstitutionService
    {
        public Task<(bool Success, List<string>? Errors, int? dbId)> CreateInstitutionAsync(CreateInstitutionDTO institutionDto);

        public Task<(bool Success, List<string>? Errors, CreateInstitutionDTO? institutionDto)> GetInstitutionByIdAsync(int id);

        public Task<(bool Success, List<string>? Errors)> DeleteInstitutionByIdAsync(int id, string adminId);

        public Task<(bool Success, List<string>? Errors)> UpdateInstitutionAsync(CreateInstitutionDTO institutionDTO, string adminId);

    }
}
