using System;
using System.Text.Json.Serialization;

namespace SalyanthanSchool.Core.DTOs.Student
{
    public class StudentResponseDto
    {
        public int Id { get; set; }

        [JsonPropertyName("fullName")]
        public string FullName =>
            string.Join(" ",
                new[] { FirstName, MiddleName, LastName }
                .Where(x => !string.IsNullOrWhiteSpace(x))
            );

        public string FirstName { get; set; } = null!;

        public string? MiddleName { get; set; }

        public string LastName { get; set; } = null!;

        public string Gender { get; set; } = null!;

        public string? BloodGroup { get; set; }

        public DateOnly? DateOfBirth { get; set; }

        public DateOnly AdmissionDate { get; set; }

        public string? Address { get; set; }

        public string? GuardianName { get; set; }

        public string? GuardianContact { get; set; }

        public int RollNo { get; set; }

        public int GradeId { get; set; }
        public string? GradeName { get; set; }

        public int SectionId { get; set; }
        public string? SectionName { get; set; }


        public string? Photo { get; set; }

        public bool IsActive { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
