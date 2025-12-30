using System;

namespace SalyanthanSchool.Core.DTOs.Subject
{
    public class SubjectResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}