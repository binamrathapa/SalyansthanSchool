namespace SalyanthanSchool.Core.DTOs.FeeHead
{
    public class FeeHeadRequestDto
    {
        public int FeeCategoryId { get; set; }
        public string Name { get; set; } = null!;
        public bool IsIndividualOnly { get; set; } = false;
    }
}