using SalyanthanSchool.Core.Common;

namespace SalyanthanSchool.Core.DTOs.Section
{
    public class SectionQueryParameter : QueryParameter
    {
        public bool? IsActive { get; set; }

        // Filter by GradeId
        public int? GradeId { get; set; }
    }
}