using Microsoft.AspNetCore.Http;
using System;

namespace SalyanthanSchool.Core.DTOs.Student
{
    public class StudentRequestDto
    {
        public string FirstName { get; set; } = null!;
        public string? MiddleName { get; set; }
        public string LastName { get; set; } = null!;
        public string Gender { get; set; } = null!; // 'Male', 'Female', 'Other'
        public string? BloodGroup { get; set; }
        public DateOnly? DateOfBirth { get; set; }
        public DateOnly AdmissionDate { get; set; }
        public string? Address { get; set; }
        public string? GuardianName { get; set; }
        public string? GuardianContact { get; set; }
        public int GradeId { get; set; }
        public int SectionId { get; set; }
        //public string? Photo { get; set; }  // Keep for storing URL/path in DB
        public bool IsActive { get; set; } = true;

        //New property for file upload
        public IFormFile? PhotoFile { get; set; }
    }

    // PATCH DTO can stay the same, unless you also want file updates
    public class StudentPatchDto
    {
        public string? FirstName { get; set; }
        public string? MiddleName { get; set; }
        public string? LastName { get; set; }
        public string? Gender { get; set; }
        public string? BloodGroup { get; set; }
        public DateOnly? DateOfBirth { get; set; }
        public string? Address { get; set; }
        public string? GuardianName { get; set; }
        public string? GuardianContact { get; set; }
        public int? GradeId { get; set; }
        public int? SectionId { get; set; }
        public bool? IsActive { get; set; }

        // Optional: add PhotoFile here if PATCH should support file updates
        public IFormFile? PhotoFile { get; set; }
    }
}
