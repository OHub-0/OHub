using PublicAPI.DTO;
using PublicAPI.Model;

namespace PublicAPI.Services
{
    public static class DomainToDtoMapper
    {
        public static void UpdateFromDto(this Institution institution, CreateInstitutionDTO institutionDto)
        {

            if (!string.IsNullOrEmpty(institutionDto.Name))
                institution.Name = institutionDto.Name;

            if (!string.IsNullOrEmpty(institutionDto.Description))
                institution.Description = institutionDto.Description;

            if (!string.IsNullOrEmpty(institutionDto.PrimaryEmail))
                institution.PrimaryEmail = institutionDto.PrimaryEmail;

            if (!string.IsNullOrEmpty(institutionDto.SecondaryEmail))
                institution.SecondaryEmail = institutionDto.SecondaryEmail;

            if (!string.IsNullOrEmpty(institutionDto.PrimaryPhone))
                institution.PrimaryPhone = institutionDto.PrimaryPhone;

            if (!string.IsNullOrEmpty(institutionDto.Country))
                institution.Country = institutionDto.Country;

            if (!string.IsNullOrEmpty(institutionDto.State))
                institution.State = institutionDto.State;

            if (!string.IsNullOrEmpty(institutionDto.City))
                institution.City = institutionDto.City;

            if (!string.IsNullOrEmpty(institutionDto.Type))
                institution.Type = institutionDto.Type;
        }

        public static CreateInstitutionDTO ToDto(this Institution institution)
        {
            return new CreateInstitutionDTO
            {
                Id = institution.Id,
                AdminId = institution.AdminId,
                Name = institution.Name,
                Description = institution.Description,
                PrimaryEmail = institution.PrimaryEmail,
                SecondaryEmail = institution.SecondaryEmail,
                PrimaryPhone = institution.PrimaryPhone,
                Country = institution.Country,
                State = institution.State,
                City = institution.City,
                Type = institution.Type
            };
        }
    }
}
