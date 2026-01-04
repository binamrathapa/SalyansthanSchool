namespace SalyanthanSchool.Core.DTOs.FeeStructure
{
    public class FeeStructureResponseDto
    {
        public int Id { get; set; }
        public string AcademicYearName { get; set; } = null!;
        public string GradeName { get; set; } = null!;
        public string FeeHeadName { get; set; } = null!;
        public decimal Amount { get; set; }
        public bool IsMonthly { get; set; }
        public DateTime? CreatedAt { get; set; }
    }
}