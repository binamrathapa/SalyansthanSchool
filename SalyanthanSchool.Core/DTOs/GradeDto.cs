using System;

namespace SalyanthanSchool.Core.DTOs
{
    public class GradeDto
    {
        public int Id { get; set; }

        // Grade name (e.g., "Grade 1", "Nursery")
        public string Name { get; set; } = default!;
    }
}
