using System;

namespace SalyanthanSchool.Core.DTOs.Section
{
    public class SectionResponseDto
    {
        public int Id { get; set; }
        public int GradeId { get; set; }
        public string GradeName { get; set; } = null!; // To show the Grade name directly
        public string Name { get; set; } = null!;
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}