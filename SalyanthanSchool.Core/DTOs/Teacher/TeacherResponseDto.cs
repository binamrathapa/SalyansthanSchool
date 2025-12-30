using System;

namespace SalyanthanSchool.Core.DTOs.Teacher
{
    public class TeacherResponseDto
    {
        public int Id { get; set; }
        public string EmployeeCode { get; set; } = null!;
        public string FullName => $"{FirstName} {MiddleName} {LastName}".Trim();
        public string FirstName { get; set; } = null!;
        public string? MiddleName { get; set; }
        public string LastName { get; set; } = null!;
        public string Gender { get; set; } = null!;
        public DateOnly DateOfBirth { get; set; }
        public string Email { get; set; } = null!;
        public string MobileNo { get; set; } = null!;
        public string? Address { get; set; }
        public string Qualification { get; set; } = null!;
        public DateOnly JoiningDate { get; set; }
        public string? Photo { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}