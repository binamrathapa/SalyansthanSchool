using SalyanthanSchool.Core.Common;

namespace SalyanthanSchool.Core.DTOs.FeeHead
{
    public class FeeHeadQueryParameter : QueryParameter
    {
        public int? FeeCategoryId { get; set; }
        public string? Name { get; set; }
    }
}