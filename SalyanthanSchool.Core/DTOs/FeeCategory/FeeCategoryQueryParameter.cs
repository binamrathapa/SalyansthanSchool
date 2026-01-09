using SalyanthanSchool.Core.Common;

namespace SalyanthanSchool.Core.DTOs.FeeCategory
{
    public class FeeCategoryQueryParameter : QueryParameter
    {
        public string? Name { get; set; }
        public string? SearchTerm { get; set; }
    }
}