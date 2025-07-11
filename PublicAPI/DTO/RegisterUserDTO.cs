﻿namespace PublicAPI.DTO
{
    public class RegisterUserDTO
    {
        public string FirstName { get; set; }
        public string? MiddleName { get; set; } 
        public string LastName { get; set; }

        public string Email { get; set; }
        public string? Username { get; set; }
        public string Password { get; set; }
        public string? PhoneNumber  { get; set; }

        public DateTime? DateofBirth { get; set; }
        public string? Address { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public string? Country { get; set; }

    }
}
