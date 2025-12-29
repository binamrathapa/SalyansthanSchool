using System;

namespace SalyanthanSchool.Core.DTOs.ClassRoutine
{
    public class ClassRoutineResponseDto
    {
        public int Id { get; set; }
        public int GradeId { get; set; }
        public string GradeName { get; set; } = null!;
        public int? SectionId { get; set; }
        public string? SectionName { get; set; }
        public int SubjectId { get; set; }
        public string SubjectName { get; set; } = null!;
        public int TeacherId { get; set; }
        public string TeacherFullName { get; set; } = null!;
        public string DayOfWeek { get; set; } = null!;
        public TimeOnly StartTime { get; set; }
        public TimeOnly EndTime { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}