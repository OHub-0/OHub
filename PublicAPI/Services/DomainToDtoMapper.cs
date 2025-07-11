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

        public static void UpdateFromDto(this Course course, CourseDTO courseDto)
        {
            if (!string.IsNullOrEmpty(courseDto.Title))
                course.Title = courseDto.Title;

            if (!string.IsNullOrEmpty(courseDto.Description))
                course.Description = courseDto.Description;

            if (courseDto.InstitutionId > 0)
                course.InstitutionId = courseDto.InstitutionId;
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

        public static CourseDTO ToDto(this Course course)
        {
            return new CourseDTO
            {
                Id = course.Id,
                Title = course.Title,
                Description = course.Description,
                InstitutionId = course.InstitutionId
            };
        }

        public static FollowDTO ToDto(this follow f)
        {
            return new FollowDTO
            {
                FollowerId = f.FollowerId,
                CourseId = f.CourseId,
                FormId = f.FormId,
                InstitutionId = f.InstitutionId
            };
        }
    }
}
