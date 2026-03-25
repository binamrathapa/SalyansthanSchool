namespace SalyanthanSchool.Core.DTOs.StudentDiscount
{
    public class StudentDiscountRequestDto
    {
        public int StudentId { get; set; }
        public int FeeHeadId { get; set; }
        public int AcademicYearId { get; set; }
        public decimal DiscountValue { get; set; }
        public bool IsPercentage { get; set; }
        public decimal MaxDiscountAmount { get; set; }
        public DateTime ValidFrom { get; set; }
        public DateTime ValidTo { get; set; }
    }
}