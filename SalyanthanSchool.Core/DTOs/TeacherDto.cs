using System;
using System.Text.Json.Serialization;
namespace SalyanthanSchool.Core.DTOs
{
    public class TeacherDTO
    {
        public int? Id { get; set; }

        // Remove FirstName, MiddleName, LastName for output
        public string FullName => string.IsNullOrWhiteSpace(MiddleName)
            ? $"{FirstName} {LastName}"
            : $"{FirstName} {MiddleName} {LastName}";

        // Keep these private for FullName calculation
        [JsonIgnore]
        public string FirstName { get; set; } = default!;

        [JsonIgnore]
        public string? MiddleName { get; set; }

        [JsonIgnore]
        public string LastName { get; set; } = default!;

        public string Address { get; set; } = default!;
        public string Email { get; set; } = default!;
        public string? PAN { get; set; }
        public string? NID { get; set; }
        public string Mobile { get; set; } = default!;
        public DateTime DateOfBirth { get; set; }
        public string Gender { get; set; } = default!;
        public string Citizenship { get; set; } = default!;
        public string Qualification { get; set; } = default!;
        public string? Photo { get; set; }
    }
}
