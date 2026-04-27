using System;

namespace SalyanthanSchool.Core.DTOs.Invoice
{
    public class GenerateBulkInvoiceDto
    {
        public int AcademicYearId { get; set; }
        public int BillingMonth { get; set; }
        public DateTime DueDate { get; set; }
        public int? GradeId { get; set; }
    }
}
