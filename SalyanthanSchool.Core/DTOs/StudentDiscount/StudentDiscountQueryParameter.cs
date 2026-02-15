using SalyanthanSchool.Core.Common;

namespace SalyanthanSchool.Core.DTOs.StudentDiscount
{
    public class StudentDiscountQueryParameter : QueryParameter
    {
        public int? StudentId { get; set; }
        public int? FeeHeadId { get; set; }
        public int? AcademicYearId { get; set; }
    }
}