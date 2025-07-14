using PublicAPI.Model;
using PublicAPI.DTO;
using System.Runtime.InteropServices;
namespace PublicAPI.Services.Interfaces
{
    public interface IFormService
    {
        Task<(bool Success, List<string> Errors, int DbId)> CreateFormAsync(FormDTO formDto);
        Task<(bool Success, List<string>? Errors, FormDTO)> GetFormByIdAsync(int id);
        Task<(bool Success, List<string> Errors)> DeleteFormAsync(int id, string userId);

        Task<(bool Success, List<string>? Errors)> UpdateFormAsync(FormDTO formDto, string userId);

        Task<(bool Success, List<string>? Errors, IEnumerable<FormDTO> formdtos)> GetForms(int courseId);
    }
}
