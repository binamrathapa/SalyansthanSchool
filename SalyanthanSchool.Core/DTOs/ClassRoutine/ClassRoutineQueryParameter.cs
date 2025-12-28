using SalyanthanSchool.Core.Common;

namespace SalyanthanSchool.Core.DTOs.ClassRoutine
{
    public class ClassRoutineQueryParameter : QueryParameter
    {
        public int? GradeId { get; set; }
        public int? SectionId { get; set; }
        public int? SubjectId { get; set; }
        public int? TeacherId { get; set; }
        public string? DayOfWeek { get; set; } // Filter by day
    }
}