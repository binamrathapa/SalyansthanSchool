namespace SalyanthanSchool.Core.DTOs.AcademicYear
{
    public class AcademicYearRequestDto
    {
        public string Name { get; set; } = null!;
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
        public bool IsActive { get; set; } = true;
    }


    public class AcademicYearPatchDto
    {
        public string? Name { get; set; }
        public DateOnly? StartDate { get; set; }
        public DateOnly? EndDate { get; set; }
        public bool? IsActive { get; set; }
    }
}