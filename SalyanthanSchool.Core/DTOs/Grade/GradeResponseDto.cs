using System;

namespace SalyanthanSchool.Core.DTOs.Grade
{
    public class GradeResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public int? SectionId { get; set; }
        public string? SectionName { get; set; }
    }
}