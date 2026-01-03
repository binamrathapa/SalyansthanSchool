namespace SalyanthanSchool.Core.DTOs.StudentDiscount
{
    public class StudentDiscountResponseDto
    {
        public int Id { get; set; }
        public int StudentId { get; set; }
        public string StudentName { get; set; } = null!;
        public string FeeHeadName { get; set; } = null!;
        public decimal DiscountAmount { get; set; } // The final calculated amount saved
    }
}