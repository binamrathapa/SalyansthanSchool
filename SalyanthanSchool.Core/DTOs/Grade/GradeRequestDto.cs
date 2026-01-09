using System;

namespace SalyanthanSchool.Core.DTOs.Grade
{
    public class GradeRequestDto
    {
        public string Name { get; set; } = null!;
        public bool IsActive { get; set; } = true;
        public int? SectionId { get; set; }
    }
}