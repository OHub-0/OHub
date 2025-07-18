﻿using PublicAPI.DTO;
using PublicAPI.Model;
using PublicAPI.Services.Interfaces;

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

        public static void UpdateFromDto(this Form form, FormDTO formdto)
        {
            if (!string.IsNullOrEmpty(formdto.Title)) form.Title = formdto.Title;
            if (!string.IsNullOrEmpty(formdto.Description)) form.Description = formdto.Description;
            form.OpenFrom = formdto.OpenFrom;
            form.OpenUntil = formdto.OpenUntil;

        }

        public static void UpdateFromDto(this UserModel user, UpdateUserDTO userdto)
        {
            if (!string.IsNullOrEmpty(userdto.FirstName)) user.FirstName = userdto.FirstName;
            if (!string.IsNullOrEmpty(userdto.MiddleName)) user.MiddleName = userdto.MiddleName;
            if (!string.IsNullOrEmpty(userdto.LastName)) user.LastName = userdto.LastName;
            if (!string.IsNullOrEmpty(userdto.PhoneNumber)) user.PhoneNumber = userdto.PhoneNumber;
            if (!string.IsNullOrEmpty(userdto.Email)) user.Email = userdto.Email;
            if (userdto.Email != null) user.Email = userdto.Email;
            if (!string.IsNullOrEmpty(userdto.Country)) user.Country = userdto.Country;
            if (!string.IsNullOrEmpty(userdto.City)) user.City = userdto.City;
            if (!string.IsNullOrEmpty(userdto.Address)) user.Address = userdto.Address;
            if (userdto.DateofBirth != null) user.DateofBirth = userdto.DateofBirth;
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

        public static FormDTO ToDto(this Form form)
        {
            return new FormDTO
            {
                Id = form.Id,
                Title = form.Title,
                Description = form.Description,
                CourseId = form.CourseId,
                OpenFrom = form.OpenFrom,
                OpenUntil = form.OpenUntil
            };
        }

        public static FollowDTO ToDto(this IFollowMapper f)
        {
            return new FollowDTO
            {
                FollowerId = f.FollowerId,
                TargetId = (byte)f.TargetId,
                TargetType = f.TargetType
                
            };
        }
    }
}
