namespace SalyanthanSchool.Core.DTOs.FeeHead
{
    public class FeeHeadResponseDto
    {
        public int Id { get; set; }
        public int FeeCategoryId { get; set; }
        public string? FeeCategoryName { get; set; } // For display in UI
        public string Name { get; set; } = null!;
        public DateTime? CreatedAt { get; set; }
    }
}