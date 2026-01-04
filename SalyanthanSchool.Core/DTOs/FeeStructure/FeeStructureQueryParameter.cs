using SalyanthanSchool.Core.Common;

namespace SalyanthanSchool.Core.DTOs.FeeStructure
{
    public class FeeStructureQueryParameter : QueryParameter
    {
        public int? AcademicYearId { get; set; }
        public int? GradeId { get; set; }
    }
}