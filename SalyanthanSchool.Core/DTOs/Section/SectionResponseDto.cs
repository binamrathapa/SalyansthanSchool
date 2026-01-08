using System;

namespace SalyanthanSchool.Core.DTOs.Section
{
    public class SectionResponseDto
    {
        public int Id { get; set; }
        public string SectionName { get; set; } = null!;
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}