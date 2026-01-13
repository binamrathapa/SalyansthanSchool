namespace SalyanthanSchool.Core.DTOs.Grade
{
    public class GradeResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<SectionSummaryDto> Sections { get; set; } = new();
    }

    public class SectionSummaryDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
    }
}