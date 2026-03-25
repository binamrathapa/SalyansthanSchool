using Microsoft.EntityFrameworkCore;
using SalyanthanSchool.Core.DTOs.StudentFee;
using SalyanthanSchool.Core.Entities;
using SalyanthanSchool.Core.Helpers;
using SalyanthanSchool.Core.Interfaces;
using SalyanthanSchool.WebAPI.Data;

namespace SalyanthanSchool.WebAPI.Services
{
    public class StudentFeeService : IStudentFeeService
    {
        private readonly SalyanthanSchoolWebAPIContext _context;
        private readonly ILogger<StudentFeeService> _logger;

        public StudentFeeService(
            SalyanthanSchoolWebAPIContext context,
            ILogger<StudentFeeService> logger)
        {
            _context = context;
            _logger  = logger;
        }

        public async Task<StudentFeeResponseDto> GetFeeReportAsync(
            int studentId,
            int? month = null)
        {
            // ── Get Current Nepali Date ────────────────────
            var today = DateTime.Now;
            var (_, nepMonth, _) = NepaliDateHelper
                .ToNepali(today);

            // ✅ Just use month number directly
            int currentMonth = month ?? nepMonth;

            // ── Step 1: Get Student ────────────────────────
            var student = await _context.Student
                .Include(s => s.Grade)
                .FirstOrDefaultAsync(s => s.Id == studentId);

            if (student == null)
                throw new KeyNotFoundException(
                    $"Student with ID {studentId} not found");

            // ── Step 2: Get Active Academic Year ───────────
            var academicYear = await _context.AcademicYear
                .FirstOrDefaultAsync(a => a.IsActive == true);

            if (academicYear == null)
                throw new KeyNotFoundException(
                    "No active academic year found");

            // ── Step 3: Get Fee Structure ──────────────────
            var feeStructures = await _context.FeeStructure
                .Include(fs => fs.FeeHead)
                .Where(fs =>
                    fs.AcademicYearId == academicYear.Id &&
                    fs.GradeId        == student.GradeId)
                .ToListAsync();

            var feeStructureDto = BuildFeeStructure(feeStructures);

            // ── Step 4: Get Discount ───────────────────────
            var discounts = await _context.StudentDiscount
                .Where(sd =>
                    sd.StudentId      == studentId       &&
                    sd.AcademicYearId == academicYear.Id &&
                    sd.IsActive       == true            &&
                    today             >= sd.ValidFrom    &&
                    today             <= sd.ValidTo)
                .ToListAsync();

            var discountDto = BuildDiscount(discounts);

            // ── Step 5: Get Previous Due ───────────────────
            var previousDueInvoices = await _context.Invoice
                .Where(i =>
                    i.StudentId       == studentId       &&
                    i.AcademicYearId  == academicYear.Id &&
                    i.BillingMonth    <  currentMonth    &&
                    i.RemainingAmount >  0)
                .OrderByDescending(i => i.BillingMonth)
                .ToListAsync();

            // ✅ Returns int month number
            var previousDueDto = BuildPreviousDue(
                previousDueInvoices);

            // ── Step 6: Get Current Month Invoice ──────────
            var currentInvoice = await _context.Invoice
                .FirstOrDefaultAsync(i =>
                    i.StudentId      == studentId       &&
                    i.AcademicYearId == academicYear.Id &&
                    i.BillingMonth   == currentMonth);

            var currentMonthPaymentDto = BuildCurrentMonthPayment(
                currentInvoice,
                feeStructureDto,
                discountDto,
                previousDueDto);

            // ── Step 7: Get Year Summary ───────────────────
            var allInvoices = await _context.Invoice
                .Where(i =>
                    i.StudentId      == studentId       &&
                    i.AcademicYearId == academicYear.Id)
                .ToListAsync();

            var yearSummaryDto = BuildYearSummary(allInvoices);

            // ── Step 8: Get Payment History ────────────────
            var payments = await _context.StudentPayment
                .Include(sp => sp.Invoice)
                .Include(sp => sp.PaymentMode)
                .Where(sp =>
                    sp.StudentId              == studentId       &&
                    sp.Invoice.AcademicYearId == academicYear.Id)
                .OrderBy(sp => sp.Invoice.BillingMonth)
                .ToListAsync();

            // ✅ Returns int month number
            var paymentHistoryDto = BuildPaymentHistory(payments);

            return new StudentFeeResponseDto
            {
                Student = new StudentInfoDto
                {
                    StudentId = student.Id
                },
                AcademicYear = academicYear.Name,

                // ✅ int month number (1-12)
                CurrentMonth = currentMonth,

                FeeStructure        = feeStructureDto,
                Discount            = discountDto,
                PreviousDue         = previousDueDto,
                CurrentMonthPayment = currentMonthPaymentDto,
                YearSummary         = yearSummaryDto,
                PaymentHistory      = paymentHistoryDto
            };
        }

        // ── All Students ───────────────────────────────────
        public async Task<List<StudentFeeResponseDto>>
            GetAllFeeReportsAsync(
                int? month      = null,
                int  pageNumber = 1,
                int  pageSize   = 30)
        {
            var students = await _context.Student
                .Where(s => s.IsActive == true)
                .OrderBy(s => s.Id)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var reports = new List<StudentFeeResponseDto>();

            foreach (var student in students)
            {
                try
                {
                    var report = await GetFeeReportAsync(
                        student.Id, month);
                    reports.Add(report);
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex,
                        "Could not get fee report for " +
                        "student {Id}", student.Id);
                }
            }

            return reports;
        }

        // ── Helper: Build Fee Structure ────────────────────
        private static FeeStructureDto BuildFeeStructure(
            List<FeeStructure> feeStructures)
        {
            var dto = new FeeStructureDto();

            foreach (var fs in feeStructures)
            {
                var headName = fs.FeeHead?.Name
                    ?? "Unknown Fee";

                if (dto.FeeItems.ContainsKey(headName))
                    dto.FeeItems[headName] += fs.Amount;
                else
                    dto.FeeItems[headName]  = fs.Amount;
            }

            dto.BaseAmount = dto.FeeItems.Values.Sum();
            return dto;
        }

        // ── Helper: Build Discount ─────────────────────────
        private static DiscountDto BuildDiscount(
            List<StudentDiscount> discounts)
        {
            if (!discounts.Any())
            {
                return new DiscountDto
                {
                    Type    = "None",
                    Amount  = 0,
                    Remarks = string.Empty
                };
            }

            return new DiscountDto
            {
                Type    = discounts.FirstOrDefault()
                              ?.DiscountType ?? "None",
                Amount  = discounts.Sum(d => d.DiscountAmount),
                Remarks = discounts.FirstOrDefault()
                              ?.Remarks ?? string.Empty
            };
        }

        // ── Helper: Build Previous Due ─────────────────────
        private static PreviousDueDto BuildPreviousDue(
            List<Invoice> previousDueInvoices)
        {
            if (!previousDueInvoices.Any())
            {
                return new PreviousDueDto
                {
                    TotalDue     = 0,
                    // ✅ 0 means no previous due
                    LastDueMonth = 0
                };
            }

            return new PreviousDueDto
            {
                TotalDue = previousDueInvoices
                    .Sum(i => i.RemainingAmount),

                // ✅ Return month number directly
                LastDueMonth = previousDueInvoices
                    .First().BillingMonth ?? 0
            };
        }

        // ── Helper: Build Current Month Payment ───────────
        private static CurrentMonthPaymentDto BuildCurrentMonthPayment(
            Invoice?        currentInvoice,
            FeeStructureDto feeStructure,
            DiscountDto     discount,
            PreviousDueDto  previousDue)
        {
            if (currentInvoice == null)
            {
                return new CurrentMonthPaymentDto
                {
                    BaseAmount      = feeStructure.BaseAmount,
                    Discount        = discount.Amount,
                    PreviousDue     = previousDue.TotalDue,
                    TotalPayable    = feeStructure.BaseAmount
                                    - discount.Amount
                                    + previousDue.TotalDue,
                    PaidAmount      = 0,
                    RemainingAmount = 0,
                    Status          = "UNPAID"
                };
            }

            return new CurrentMonthPaymentDto
            {
                BaseAmount      = currentInvoice.TotalAmount,
                Discount        = currentInvoice.DiscountAmount,
                PreviousDue     = currentInvoice.PreviousDue,
                TotalPayable    = currentInvoice.TotalAmount
                                - currentInvoice.DiscountAmount
                                + currentInvoice.PreviousDue,
                PaidAmount      = currentInvoice.PaidAmount,
                RemainingAmount = currentInvoice.RemainingAmount,
                Status          = GetStatusName(currentInvoice.Status)
            };
        }

        // ── Helper: Build Year Summary ─────────────────────
        private static YearSummaryDto BuildYearSummary(
            List<Invoice> allInvoices)
        {
            if (!allInvoices.Any())
                return new YearSummaryDto();

            return new YearSummaryDto
            {
                TotalYearFee  = allInvoices.Sum(i => i.TotalAmount),
                TotalDiscount = allInvoices.Sum(i => i.DiscountAmount),
                TotalPaid     = allInvoices.Sum(i => i.PaidAmount),
                TotalDue      = allInvoices.Sum(i => i.RemainingAmount)
            };
        }

        // ── Helper: Build Payment History ──────────────────
        private static List<PaymentHistoryDto> BuildPaymentHistory(
            List<StudentPayment> payments)
        {
            if (!payments.Any())
                return new List<PaymentHistoryDto>();

            return payments.Select(p => new PaymentHistoryDto
            {
                PaymentId = p.Id,

                // ✅ Return month number directly
                Month     = p.Invoice?.BillingMonth ?? 0,

                Amount     = p.Invoice?.TotalAmount ?? 0,
                PaidAmount = p.AmountPaid,
                Status     = GetStatusName(
                    p.Invoice?.Status ?? InvoiceStatus.Unpaid),
                Date       = p.PaymentDate
                    .ToString("yyyy-MM-dd"),
                ReceiptNo  = p.ReceiptNo ?? string.Empty,
                Method     = p.PaymentMode?.Name ?? string.Empty
            }).ToList();
        }

        // ── Helper: Status to String ───────────────────────
        private static string GetStatusName(InvoiceStatus status)
            => status switch
            {
                InvoiceStatus.Unpaid    => "UNPAID",
                InvoiceStatus.Paid      => "PAID",
                InvoiceStatus.Partial   => "PARTIAL",
                InvoiceStatus.Overdue   => "OVERDUE",
                InvoiceStatus.Cancelled => "CANCELLED",
                _                       => "UNPAID"
            };
    }
}