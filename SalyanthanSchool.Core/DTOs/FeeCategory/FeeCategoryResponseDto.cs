namespace SalyanthanSchool.Core.DTOs.Account.FeeCategory
{
    public class FeeCategoryResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public DateTime? CreatedAt { get; set; }
    }
}