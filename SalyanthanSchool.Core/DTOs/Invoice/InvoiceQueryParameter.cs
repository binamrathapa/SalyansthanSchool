using SalyanthanSchool.Core.Common;

namespace SalyanthanSchool.Core.DTOs.Invoice
{
    public class InvoiceQueryParameter : QueryParameter
    {
        public int? StudentId { get; set; }
        public string? Status { get; set; }
        public string? InvoiceNo { get; set; }
    }
}