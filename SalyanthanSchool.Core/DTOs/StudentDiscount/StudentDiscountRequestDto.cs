namespace SalyanthanSchool.Core.DTOs.StudentDiscount
{
    public class StudentDiscountRequestDto
    {
        public int StudentId { get; set; }
        public int FeeHeadId { get; set; }
        public decimal DiscountValue { get; set; } // Can be % or flat based on logic
        public bool IsPercentage { get; set; }     // To tell service how to calculate
    }
}