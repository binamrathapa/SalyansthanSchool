using System;
using System.Collections.Generic;

namespace SalyanthanSchool.Core.DTOs.Invoice
{
    public class GenerateInvoiceDto
    {
        public int AcademicYearId { get; set; }
        public int BillingMonth { get; set; }
        public DateTime DueDate { get; set; }
        public int? GradeId { get; set; }
        public int? SectionId { get; set; }
        public int? StudentId { get; set; }
        public List<CustomFeeItemDto>? CustomItems { get; set; }
    }

    public class CustomFeeItemDto
    {
        public int FeeHeadId { get; set; }
        public decimal Amount { get; set; }
        public string? Description { get; set; }
    }
}