using SalyanthanSchool.Core.Common;

namespace SalyanthanSchool.Core.DTOs.Teacher
{
    public class TeacherQueryParameter : QueryParameter
    {
        public bool? IsActive { get; set; }

        // Optional filter for qualification
        public string? Qualification { get; set; }
    }
}