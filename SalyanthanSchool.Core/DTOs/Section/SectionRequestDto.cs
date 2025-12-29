namespace SalyanthanSchool.Core.DTOs.Section
{
    public class SectionRequestDto
    {
        public int GradeId { get; set; }
        public string Name { get; set; } = null!;
        public bool IsActive { get; set; } = true;
    }
}