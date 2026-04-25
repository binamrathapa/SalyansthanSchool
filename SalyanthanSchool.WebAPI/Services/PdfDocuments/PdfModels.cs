using System;
using System.Collections.Generic;

namespace SalyanthanSchool.WebAPI.Services.PdfDocuments
{
    public class PdfSchoolInfo
    {
        public string Name { get; set; } = "SALYANSTHAN SECONDARY SCHOOL";
        public string Address { get; set; } = "Kirtipur-4, Salyansthan, Kathmandu";
        public string Phone { get; set; } = "01-5904264";
        public string Email { get; set; } = "schoolsalyansthan@gmail.com";
        public string? LogoPath { get; set; }
    }

    public class PdfStudentInfo
    {
        public int StudentId { get; set; }
        public string Name { get; set; } = null!;
        public string AdmissionNo { get; set; } = "N/A";
        public string Grade { get; set; } = null!;
        public string? Section { get; set; }
        public int RollNo { get; set; }
        public string? Address { get; set; }
    }

    public class PdfBillInfo
    {
        public string InvoiceNo { get; set; } = null!;
        public string AcademicYear { get; set; } = null!;
        public int Month { get; set; }
        public string MonthName { get; set; } = null!;
        public DateTime DueDate { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal PreviousDue { get; set; }
        public decimal Discount { get; set; }
        public decimal PayableAmount { get; set; }
        public decimal PaidAmount { get; set; }
        public decimal RemainingAmount { get; set; }
        public List<PdfBillItem> Items { get; set; } = new();
        public PdfYearSummary YearSummary { get; set; } = new();
    }

    public class PdfYearSummary
    {
        public decimal TotalYearFee { get; set; }
        public decimal TotalDiscount { get; set; }
        public decimal TotalDue { get; set; }
    }

    public class PdfBillItem
    {
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public decimal Amount { get; set; }
    }

    public class PdfPaymentInfo
    {
        public int PaymentId { get; set; }
        public string ReceiptNo { get; set; } = null!;
        public string Date { get; set; } = null!;
        public decimal PaidAmount { get; set; }
        public string PaidAmountWords { get; set; } = null!;
        public string Method { get; set; } = null!;
        public string Status { get; set; } = null!;
    }
}
