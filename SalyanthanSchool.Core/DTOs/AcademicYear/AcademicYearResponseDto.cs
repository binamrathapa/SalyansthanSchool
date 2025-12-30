namespace SalyanthanSchool.Core.DTOs.AcademicYear
{
    public class AcademicYearResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
        public bool IsActive { get; set; }
    }
}