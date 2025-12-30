using System;

namespace SalyanthanSchool.Core.DTOs.ClassRoutine
{
    public class ClassRoutineRequestDto
    {
        public int GradeId { get; set; }
        public int? SectionId { get; set; } // Nullable
        public int SubjectId { get; set; }
        public int TeacherId { get; set; }
        public string DayOfWeek { get; set; } = null!; // e.g., "Monday"
        public TimeOnly StartTime { get; set; }
        public TimeOnly EndTime { get; set; }
    }
}