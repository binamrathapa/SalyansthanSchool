using System;
using System.Text.Json.Serialization;

namespace SalyanthanSchool.Core.DTOs
{
    public class StudentDto
    {
        public int Id { get; set; }


        // Keep these private for FullName calculation
        [JsonIgnore]
        public string FirstName { get; set; } = default!;

        [JsonIgnore]
        public string? MiddleName { get; set; }

        [JsonIgnore]
        public string LastName { get; set; } = default!;


        // Computed for API output
        public string FullName => string.Join(" ", new[] { FirstName, MiddleName, LastName }
                                                    .Where(n => !string.IsNullOrWhiteSpace(n)));
        public string ParentName { get; set; } = default!;
        public string GuardianName { get; set; } = default!;
        public string Mobile { get; set; } = default!;
        public string Address { get; set; } = default!;
        public DateTime DateOfBirth { get; set; }
        public DateTime AdmissionDate { get; set; }
        public string BloodGroup { get; set; } = default!;
        public string Gender { get; set; } = default!;
        public string? Photo { get; set; }

    }
}
