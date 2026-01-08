namespace SalyanthanSchool.Core.DTOs.Section
{
    public class SectionRequestDto
    {
        public string SectionName { get; set; } = null!;
        public bool IsActive { get; set; } = true;
    }
}