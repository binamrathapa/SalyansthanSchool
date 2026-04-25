using Microsoft.EntityFrameworkCore;
using QuestPDF.Fluent;
using QuestPDF.Infrastructure;
using SalyanthanSchool.Core.Entities;
using SalyanthanSchool.Core.Interfaces;
using SalyanthanSchool.WebAPI.Data;
using SalyanthanSchool.WebAPI.Helpers;
using SalyanthanSchool.WebAPI.Services.PdfDocuments;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SalyanthanSchool.WebAPI.Services
{
    public class InvoicePdfService : IInvoicePdfService
    {
        private readonly SalyanthanSchoolWebAPIContext _context;
        private readonly Microsoft.Extensions.Configuration.IConfiguration _configuration;

        public InvoicePdfService(SalyanthanSchoolWebAPIContext context, Microsoft.Extensions.Configuration.IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
            // Set QuestPDF license (Community is free for small teams/open source)
            QuestPDF.Settings.License = LicenseType.Community;
        }

        public async Task<byte[]> GenerateBillPdfAsync(
            int  studentId,
            int? month          = null,
            int? academicYearId = null)
        {
            var student = await _context.Student
                .Include(s => s.Grade)
                .Include(s => s.Section)
                .FirstOrDefaultAsync(s => s.Id == studentId);

            if (student == null) throw new KeyNotFoundException($"Student {studentId} not found");

            // Get invoices for the student
            var query = _context.Invoice
                .Include(i => i.AcademicYear)
                .Include(i => i.InvoiceItems)
                    .ThenInclude(ii => ii.FeeHead)
                .Where(i => i.StudentId == studentId);

            if (academicYearId.HasValue)
            {
                query = query.Where(i => i.AcademicYearId == academicYearId.Value);
            }

            var allInvoices = await query
                .OrderBy(i => i.BillingMonth)
                .ToListAsync();

            var invoice = month.HasValue 
                ? allInvoices.LastOrDefault(i => i.BillingMonth == month.Value)
                : allInvoices.LastOrDefault();

            if (invoice == null) throw new KeyNotFoundException("No invoice found for the specified period");

            // Map to PDF models
            var schoolInfo = GetSchoolInfo();
            var studentInfo = new PdfStudentInfo
            {
                StudentId   = student.Id,
                Name        = $"{student.FirstName} {student.LastName}",
                AdmissionNo = student.Id.ToString(), // TODO: Use real AdmissionNo if available
                Grade       = student.Grade.Name,
                Section     = student.Section?.SectionName,
                RollNo      = student.RollNo,
                Address     = student.Address
            };

            var billInfo = new PdfBillInfo
            {
                InvoiceNo      = invoice.InvoiceNo,
                AcademicYear   = invoice.AcademicYear?.Name ?? "N/A",
                Month          = invoice.BillingMonth ?? 0,
                MonthName      = GetMonthName(invoice.BillingMonth),
                DueDate        = invoice.DueDate,
                TotalAmount    = invoice.TotalAmount, // Gross Amount
                PreviousDue    = invoice.PreviousDue,
                Discount       = invoice.DiscountAmount,
                PayableAmount  = invoice.TotalAmount - invoice.DiscountAmount + invoice.PreviousDue,
                PaidAmount     = invoice.PaidAmount,
                RemainingAmount = invoice.TotalAmount - invoice.DiscountAmount + invoice.PreviousDue - invoice.PaidAmount,
                Items = invoice.InvoiceItems.Select(it => new PdfBillItem
                {
                    Name        = it.FeeHead?.Name ?? "Fee",
                    Description = it.Description,
                    Amount      = it.Amount
                }).ToList(),
                YearSummary = new PdfYearSummary
                {
                    TotalYearFee  = allInvoices.Sum(i => i.TotalAmount),
                    TotalDiscount = allInvoices.Sum(i => i.DiscountAmount),
                    TotalDue      = allInvoices.Sum(i => 
                                        i.TotalAmount - i.DiscountAmount + i.PreviousDue - i.PaidAmount)
                }
            };

            var document = new BillDocument(schoolInfo, studentInfo, billInfo);
            return document.GeneratePdf();
        }

        public async Task<byte[]> GenerateReceiptPdfAsync(int studentId, int paymentId)
        {
            var student = await _context.Student
                .Include(s => s.Grade)
                .FirstOrDefaultAsync(s => s.Id == studentId);

            if (student == null) throw new KeyNotFoundException($"Student {studentId} not found");

            var payment = await _context.StudentPayment
                .Include(p => p.PaymentMode)
                .Include(p => p.Invoice)
                    .ThenInclude(i => i.AcademicYear)
                .Include(p => p.Invoice)
                    .ThenInclude(i => i.InvoiceItems)
                        .ThenInclude(ii => ii.FeeHead)
                .FirstOrDefaultAsync(p => p.Id == paymentId && p.StudentId == studentId);

            if (payment == null || payment.Invoice == null) 
                throw new KeyNotFoundException($"Payment {paymentId} or associated invoice not found");

            var schoolInfo = GetSchoolInfo();
            var studentInfo = new PdfStudentInfo
            {
                Name        = $"{student.FirstName} {student.LastName}",
                AdmissionNo = student.Id.ToString(),
                Grade       = student.Grade.Name,
                Section     = student.Section?.SectionName,
                RollNo      = student.RollNo
            };

            var paymentInfo = new PdfPaymentInfo
            {
                PaymentId       = payment.Id,
                ReceiptNo       = payment.ReceiptNo ?? "N/A",
                Date            = payment.PaymentDate.ToString("yyyy-MM-dd"),
                PaidAmount      = payment.AmountPaid,
                PaidAmountWords = NumberToWordsConverter.Convert(payment.AmountPaid),
                Method          = payment.PaymentMode?.Name ?? "Cash",
                Status          = payment.Invoice.Status.ToString()
            };

            // Reuse the bill mapping logic for the breakdown in receipt
            var billInfo = new PdfBillInfo
            {
                AcademicYear = payment.Invoice.AcademicYear?.Name ?? "N/A",
                MonthName    = GetMonthName(payment.Invoice.BillingMonth),
                PayableAmount = payment.Invoice.TotalAmount + payment.Invoice.PreviousDue, // Consistent with Bill
                RemainingAmount = payment.Invoice.RemainingAmount,
                Items = payment.Invoice.InvoiceItems.Select(it => new PdfBillItem
                {
                    Name   = it.FeeHead?.Name ?? "Fee",
                    Amount = it.Amount
                }).ToList()
            };

            var document = new ReceiptDocument(schoolInfo, studentInfo, paymentInfo, billInfo);
            return document.GeneratePdf();
        }

        private PdfSchoolInfo GetSchoolInfo()
        {
            var section = _configuration.GetSection("SchoolInfo");
            return new PdfSchoolInfo
            {
                Name    = section["Name"] ?? "SALYANSTHAN SECONDARY SCHOOL",
                Address = section["Address"] ?? "Kirtipur-4, Salyansthan, Kathmandu",
                Phone   = section["Phone"] ?? "01-5904264",
                Email   = section["Email"] ?? "schoolsalyansthan@gmail.com"
            };
        }

        private string GetMonthName(int? month)
        {
            if (!month.HasValue) return "N/A";
            return month.Value switch
            {
                1 => "Baishakh",
                2 => "Jestha",
                3 => "Ashad",
                4 => "Shrawan",
                5 => "Bhadra",
                6 => "Ashwin",
                7 => "Kartik",
                8 => "Mangshir",
                9 => "Poush",
                10 => "Magh",
                11 => "Falgun",
                12 => "Chaitra",
                _ => "Unknown"
            };
        }
    }
}
