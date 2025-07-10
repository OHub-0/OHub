using PublicAPI.Model;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace PublicAPI.DTO
{
    public class CreateInstitutionDTO
    {       
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string AdminId { get; set; }
        public string? PrimaryPhone { get; set; }
        public string PrimaryEmail { get; set; }
        public string? SecondaryEmail { get; set; }
        public string Country { get; set; }
        public string State { get; set; }
        public string City { get; set; }

        public string Type { get; set; }
    }
}
