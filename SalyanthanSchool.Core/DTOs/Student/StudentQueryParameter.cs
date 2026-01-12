using SalyanthanSchool.Core.Common;

namespace SalyanthanSchool.Core.DTOs.Student
{
    public class StudentQueryParameter : QueryParameter
    {
        public bool? IsActive { get; set; }
        public string? GradeName { get; set; }
        //public int? SectionId { get; set; }
        public string? Gender { get; set; }
    }
}