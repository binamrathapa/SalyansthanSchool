namespace SalyanthanSchool.Core.DTOs.FeeStructure
{
    public class FeeStructureRequestDto
    {
        public int AcademicYearId { get; set; }
        public int GradeId { get; set; }
        public int FeeHeadId { get; set; }
        public decimal Amount { get; set; }
        public bool IsMonthly { get; set; } // True for tuition, False for Admission/Exam fees
    }
}