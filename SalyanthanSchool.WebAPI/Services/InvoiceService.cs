using Microsoft.EntityFrameworkCore;
using SalyanthanSchool.Core.DTOs.Invoice;
using SalyanthanSchool.Core.Entities;
using SalyanthanSchool.Core.Interfaces;
using SalyanthanSchool.WebAPI.Data;

namespace SalyanthanSchool.WebAPI.Services
{
    public class InvoiceService : IInvoiceService
    {
        private readonly SalyanthanSchoolWebAPIContext _context;
        private readonly ILogger<InvoiceService> _logger;

        public InvoiceService(
            SalyanthanSchoolWebAPIContext context,
            ILogger<InvoiceService> logger)
        {
            _context = context;
            _logger  = logger;
        }

        // ── Generate Monthly Invoices ──────────────────────
        public async Task<GenerateInvoiceResultDto> 
            GenerateMonthlyInvoicesAsync(GenerateInvoiceDto dto)
        {
            var result = new GenerateInvoiceResultDto
            {
                BillingMonth = dto.BillingMonth,
                Message      = "Generation completed"
            };

            // ── Validate ───────────────────────────────────
            var academicYear = await _context.AcademicYear
                .FirstOrDefaultAsync(
                    a => a.Id == dto.AcademicYearId);

            if (academicYear == null)
            {
                result.Message = "Academic year not found";
                result.Errors.Add("Invalid AcademicYearId");
                return result;
            }

            // ── Get Students ───────────────────────────────
            var studentsQuery = _context.Student
                .Where(s => s.IsActive == true);

            if (dto.GradeId.HasValue)
                studentsQuery = studentsQuery
                    .Where(s => s.GradeId == dto.GradeId.Value);

            if (dto.SectionId.HasValue)
                studentsQuery = studentsQuery
                    .Where(s => s.SectionId == dto.SectionId.Value);

            if (dto.StudentId.HasValue)
                studentsQuery = studentsQuery
                    .Where(s => s.Id == dto.StudentId.Value);

            var students = await studentsQuery.ToListAsync();

            if (!students.Any())
            {
                result.Message = "No active students found";
                return result;
            }

            // ── Process Each Student ───────────────────────
            // ✅ Transaction for rollback support
            using var transaction = await _context.Database
                .BeginTransactionAsync();

            try
            {
                foreach (var student in students)
                {
                    try
                    {
                        // ── Existing Invoice Check ────────
                        var existingInvoice = await _context.Invoice
                            .Include(i => i.InvoiceItems)
                            .FirstOrDefaultAsync(i =>
                                i.StudentId      == student.Id         &&
                                i.BillingMonth   == dto.BillingMonth   &&
                                i.AcademicYearId == dto.AcademicYearId);

                        if (existingInvoice != null)
                        {
                            // 1. If CustomItems are provided, append them to the existing invoice
                            if (dto.CustomItems != null && dto.CustomItems.Any())
                            {
                                foreach (var custom in dto.CustomItems)
                                {
                                    var item = new InvoiceItem
                                    {
                                        FeeHeadId   = custom.FeeHeadId,
                                        Amount      = custom.Amount,
                                        Description = custom.Description ?? "Custom Fee",
                                        InvoiceId   = existingInvoice.Id
                                    };
                                    _context.InvoiceItem.Add(item);

                                    existingInvoice.TotalAmount     += custom.Amount;
                                    existingInvoice.RemainingAmount += custom.Amount;
                                }

                                // Update status if it was PAID/PARTIAL
                                if (existingInvoice.PaidAmount > 0)
                                    existingInvoice.Status = InvoiceStatus.Partial;
                                else
                                    existingInvoice.Status = InvoiceStatus.Unpaid;

                                existingInvoice.UpdatedAt = DateTime.UtcNow;
                                result.InvoicesCreated++;
                                continue;
                            }

                            // 2. Fallback to Replace logic if explicitly requested
                            if (dto.IsReplace && existingInvoice.Status == InvoiceStatus.Unpaid)
                            {
                                _context.Invoice.Remove(existingInvoice);
                                await _context.SaveChangesAsync();
                            }
                            else
                            {
                                result.InvoicesSkipped++;
                                continue;
                            }
                        }

                        // Get fee structure
                        List<FeeStructure> fees;
                        if (dto.FeeStructureIds != null && dto.FeeStructureIds.Any())
                        {
                            fees = await _context.FeeStructure
                                .Include(f => f.FeeHead)
                                .Where(f => dto.FeeStructureIds.Contains(f.Id))
                                .ToListAsync();
                        }
                        else
                        {
                            fees = await _context.FeeStructure
                                .Include(f => f.FeeHead)
                                .Where(f =>
                                    f.GradeId == student.GradeId &&
                                    f.AcademicYearId == dto.AcademicYearId)
                                .ToListAsync();
                        }

                        if (!fees.Any() && (dto.CustomItems == null || !dto.CustomItems.Any()))
                        {
                            result.InvoicesSkipped++;
                            result.Errors.Add(
                                $"No fees or custom items to assign for student {student.Id}");
                            continue;
                        }

                        // Get student discounts
                        var discounts = await _context.StudentDiscount
                            .Where(d =>
                                d.StudentId      == student.Id          &&
                                d.AcademicYearId == dto.AcademicYearId  &&
                                d.IsActive       == true                &&
                                DateTime.UtcNow  >= d.ValidFrom         &&
                                DateTime.UtcNow  <= d.ValidTo)
                            .ToListAsync();

                        // ── Calculate Previous Due ─────────
                        // Sum remaining from all past invoices
                        decimal previousDue = await _context.Invoice
                            .Where(i =>
                                i.StudentId      == student.Id         &&
                                i.AcademicYearId == dto.AcademicYearId &&
                                i.BillingMonth   <  dto.BillingMonth   &&
                                (i.TotalAmount - i.DiscountAmount + i.PreviousDue - i.PaidAmount) > 0)
                            .SumAsync(i => i.TotalAmount - i.DiscountAmount + i.PreviousDue - i.PaidAmount);

                        // ── Calculate Discount ─────────────
                        decimal totalDiscount = discounts
                            .Sum(d => d.DiscountAmount);

                        // ── Build Invoice ──────────────────
                        // NOTE: TotalAmount is the NET amount (Base - Discount)
                        var invoice = new Invoice
                        {
                            StudentId      = student.Id,
                            AcademicYearId = dto.AcademicYearId,
                            BillingMonth   = dto.BillingMonth,
                            InvoiceNo      = GenerateInvoiceNo(
                                student.Id,
                                dto.BillingMonth,
                                dto.AcademicYearId),
                            DueDate        = dto.DueDate,
                            Status         = InvoiceStatus.Unpaid,
                            DiscountAmount = totalDiscount,
                            PreviousDue    = previousDue,
                            PaidAmount     = 0,
                            CreatedAt      = DateTime.UtcNow
                        };

                        // ── Add Invoice Items ──────────────
                        decimal currentMonthGross = 0;
                        var invoiceItems = new List<InvoiceItem>();

                        // 1. Add Standard/Selected Fees
                        foreach (var fee in fees)
                        {
                            var item = new InvoiceItem();
                            item.FeeHeadId   = fee.FeeHeadId;
                            item.Amount      = fee.Amount;
                            item.Description = fee.FeeHead?.Name ?? "Fee";
                            item.Invoice     = invoice;

                            invoiceItems.Add(item);
                            currentMonthGross += fee.Amount;
                        }

                        // 2. Add Custom Ad-hoc Fees
                        if (dto.CustomItems != null && dto.CustomItems.Any())
                        {
                            foreach (var custom in dto.CustomItems)
                            {
                                var item = new InvoiceItem
                                {
                                    FeeHeadId   = custom.FeeHeadId,
                                    Amount      = custom.Amount,
                                    Description = custom.Description ?? "Custom Fee",
                                    Invoice     = invoice
                                };
                                invoiceItems.Add(item);
                                currentMonthGross += custom.Amount;
                            }
                        }

                        // ── Set Total & Remaining ──────────
                        invoice.TotalAmount      = currentMonthGross;
                        invoice.RemainingAmount  = currentMonthGross
                                                 - totalDiscount
                                                 + previousDue;
                        invoice.InvoiceItems     = invoiceItems;

                        if (invoice.TotalAmount > 0)
                        {
                            await _context.Invoice.AddAsync(invoice);
                            result.InvoicesCreated++;
                        }
                    }
                    catch (Exception ex)
                    {
                        // Log individual student error but continue
                        _logger.LogError(ex,
                            "Error generating invoice for " +
                            "student {Id}", student.Id);

                        result.Errors.Add(
                            $"Student {student.Id}: {ex.Message}");
                    }
                }

                // ✅ Save all invoices
                await _context.SaveChangesAsync();

                // ✅ Commit transaction
                await transaction.CommitAsync();

                result.Message = $"Generated {result.InvoicesCreated} " +
                                 $"invoices, skipped {result.InvoicesSkipped}";

                return result;
            }
            catch (Exception ex)
            {
                // ✅ Rollback ALL if critical error
                await transaction.RollbackAsync();

                _logger.LogError(ex,
                    "Critical error generating invoices. " +
                    "All changes rolled back.");

                result.InvoicesCreated = 0;
                result.Message         = "Generation failed - all changes rolled back";
                result.Errors.Add(ex.Message);

                return result;
            }
        }

        // ── Process Payment ────────────────────────────────
        public async Task<PaymentResultDto> ProcessPaymentAsync(
            PaymentRequestDto dto)
        {
            // ✅ Transaction for rollback
            using var transaction = await _context.Database
                .BeginTransactionAsync();

            try
            {
                // ── Get Invoice ────────────────────────────
                var invoice = await _context.Invoice
                    .Include(i => i.Payments)
                    .FirstOrDefaultAsync(i => i.Id == dto.InvoiceId);

                // Validate invoice
                if (invoice == null)
                {
                    return new PaymentResultDto
                    {
                        Success = false,
                        Message = "Invoice not found"
                    };
                }

                // ✅ Lock: Cannot pay already PAID invoice
                if (invoice.Status == InvoiceStatus.Paid)
                {
                    return new PaymentResultDto
                    {
                        Success = false,
                        Message = "Invoice is already PAID and locked"
                    };
                }

                // ✅ Overpayment Check
                if (dto.AmountPaid > invoice.RemainingAmount)
                {
                    return new PaymentResultDto
                    {
                        Success = false,
                        Message = $"Payment rejected. Maximum payable amount is {invoice.RemainingAmount:N2}. " +
                                  $"Please adjust the amount or use credit balance features."
                    };
                }

                // ✅ Lock: Cannot pay CANCELLED invoice
                if (invoice.Status == InvoiceStatus.Cancelled)
                {
                    return new PaymentResultDto
                    {
                        Success = false,
                        Message = "Invoice is CANCELLED cannot process payment"
                    };
                }

                // Validate amount
                if (dto.AmountPaid <= 0)
                {
                    return new PaymentResultDto
                    {
                        Success = false,
                        Message = "Payment amount must be greater than 0"
                    };
                }

                // Check overpayment
                if (dto.AmountPaid > invoice.RemainingAmount)
                {
                    return new PaymentResultDto
                    {
                        Success = false,
                        Message = $"Payment amount ({dto.AmountPaid}) " +
                                  $"exceeds remaining amount " +
                                  $"({invoice.RemainingAmount})"
                    };
                }

                // ── Generate Unique IDs ────────────────────
                string receiptNo = string.IsNullOrWhiteSpace(dto.ReceiptNo)
                    ? GenerateReceiptNo(dto.InvoiceId)
                    : dto.ReceiptNo;

                string transactionId = string.IsNullOrWhiteSpace(dto.TransactionId)
                    ? $"TXN-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString().Substring(0, 8).ToUpper()}"
                    : dto.TransactionId;

                // ── Update Invoice ─────────────────────────
                decimal totalPaidSoFar = invoice.Payments
                    .Sum(p => p.AmountPaid) + dto.AmountPaid;

                // ── Create Payment ─────────────────────────
                var payment = new StudentPayment
                {
                    InvoiceId     = dto.InvoiceId,
                    StudentId     = invoice.StudentId,
                    AmountPaid    = dto.AmountPaid,
                    PaymentDate   = dto.PaymentDate,
                    PaymentModeId = dto.PaymentModeId,
                    TransactionId = transactionId,
                    ReceiptNo     = receiptNo,
                    Remarks       = dto.Remarks,
                    CreatedAt     = DateTime.UtcNow
                };

                _context.StudentPayment.Add(payment);

                invoice.PaidAmount      = totalPaidSoFar;
                invoice.RemainingAmount = invoice.TotalAmount
                                        - invoice.DiscountAmount
                                        + invoice.PreviousDue
                                        - totalPaidSoFar;
                invoice.UpdatedAt       = DateTime.UtcNow;

                // ── Update Status ──────────────────────────
                decimal totalPayable = invoice.TotalAmount 
                                     - invoice.DiscountAmount 
                                     + invoice.PreviousDue;

                if (totalPaidSoFar >= totalPayable)
                {
                    invoice.Status          = InvoiceStatus.Paid;
                    invoice.RemainingAmount = 0;
                }
                else if (totalPaidSoFar > 0)
                {
                    invoice.Status = InvoiceStatus.Partial;
                }

                await _context.SaveChangesAsync();

                // ✅ Commit
                await transaction.CommitAsync();

                return new PaymentResultDto
                {
                    Success         = true,
                    Message         = "Payment recorded successfully",
                    NewStatus       = invoice.Status.ToString(),
                    PaidAmount      = dto.AmountPaid,
                    RemainingAmount = invoice.RemainingAmount,
                    ReceiptNo       = receiptNo
                };
            }
            catch (DbUpdateConcurrencyException)
            {
                // ✅ Bug #6: Concurrency conflict detected
                await transaction.RollbackAsync();

                _logger.LogWarning(
                    "Concurrency conflict on invoice {Id}. " +
                    "Another payment was processed simultaneously.",
                    dto.InvoiceId);

                return new PaymentResultDto
                {
                    Success = false,
                    Message = "This invoice was modified by another " +
                              "user. Please refresh and try again."
                };
            }
            catch (Exception ex)
            {
                // ✅ Rollback on error
                await transaction.RollbackAsync();

                _logger.LogError(ex,
                    "Payment failed for invoice {Id}. " +
                    "Changes rolled back.", dto.InvoiceId);

                return new PaymentResultDto
                {
                    Success = false,
                    Message = $"Payment failed: {ex.Message}"
                };
            }
        }

        // ── Rollback Invoice ───────────────────────────────
        public async Task<bool> RollbackInvoiceAsync(
            int invoiceId, string reason)
        {
            // ✅ Transaction for rollback
            using var transaction = await _context.Database
                .BeginTransactionAsync();

            try
            {
                var invoice = await _context.Invoice
                    .Include(i => i.Payments)
                    .Include(i => i.InvoiceItems)
                    .FirstOrDefaultAsync(i => i.Id == invoiceId);

                if (invoice == null)
                {
                    _logger.LogWarning(
                        "Rollback failed: Invoice {Id} not found",
                        invoiceId);
                    return false;
                }

                // Cannot rollback already cancelled invoice
                if (invoice.Status == InvoiceStatus.Cancelled)
                {
                    _logger.LogWarning(
                        "Invoice {Id} is already cancelled",
                        invoiceId);
                    return false;
                }

                // Cannot rollback paid invoice with payments
                if (invoice.Status == InvoiceStatus.Paid &&
                    invoice.Payments.Any())
                {
                    _logger.LogWarning(
                        "Cannot rollback paid invoice {Id} " +
                        "with existing payments", invoiceId);
                    return false;
                }

                // ✅ Mark as Cancelled
                invoice.Status    = InvoiceStatus.Cancelled;
                invoice.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                // ✅ Commit
                await transaction.CommitAsync();

                _logger.LogInformation(
                    "Invoice {Id} rolled back. Reason: {Reason}",
                    invoiceId, reason);

                return true;
            }
            catch (Exception ex)
            {
                // ✅ Rollback
                await transaction.RollbackAsync();

                _logger.LogError(ex,
                    "Failed to rollback invoice {Id}",
                    invoiceId);

                return false;
            }
        }

        // ── Rollback Payment ───────────────────────────────
        public async Task<bool> RollbackPaymentAsync(
            int paymentId, string reason)
        {
            // ✅ Transaction for rollback
            using var transaction = await _context.Database
                .BeginTransactionAsync();

            try
            {
                var payment = await _context.StudentPayment
                    .FirstOrDefaultAsync(p => p.Id == paymentId);

                if (payment == null)
                {
                    _logger.LogWarning(
                        "Rollback failed: Payment {Id} not found",
                        paymentId);
                    return false;
                }

                var invoice = await _context.Invoice
                    .Include(i => i.Payments)
                    .FirstOrDefaultAsync(
                        i => i.Id == payment.InvoiceId);

                if (invoice == null)
                {
                    _logger.LogWarning(
                        "Rollback failed: Invoice not found " +
                        "for payment {Id}", paymentId);
                    return false;
                }

                decimal reversedAmount = payment.AmountPaid;

                // ✅ Remove payment
                _context.StudentPayment.Remove(payment);

                // ✅ Recalculate invoice amounts
                decimal remainingPayments = invoice.Payments
                    .Where(p => p.Id != paymentId)
                    .Sum(p => p.AmountPaid);

                invoice.PaidAmount      = remainingPayments;
                invoice.RemainingAmount = invoice.TotalAmount
                                        - invoice.DiscountAmount
                                        + invoice.PreviousDue
                                        - remainingPayments;
                invoice.UpdatedAt       = DateTime.UtcNow;

                // ── Recalculate status ────────────────────
                decimal totalPayable = invoice.TotalAmount 
                                     - invoice.DiscountAmount 
                                     + invoice.PreviousDue;

                if (remainingPayments <= 0)
                    invoice.Status = InvoiceStatus.Unpaid;
                else if (remainingPayments < totalPayable)
                    invoice.Status = InvoiceStatus.Partial;
                else
                    invoice.Status = InvoiceStatus.Paid;

                await _context.SaveChangesAsync();

                // ✅ Commit
                await transaction.CommitAsync();

                _logger.LogInformation(
                    "Payment {Id} reversed (Amount: {Amount}). " +
                    "Reason: {Reason}",
                    paymentId, reversedAmount, reason);

                return true;
            }
            catch (Exception ex)
            {
                // ✅ Rollback
                await transaction.RollbackAsync();

                _logger.LogError(ex,
                    "Failed to rollback payment {Id}",
                    paymentId);

                return false;
            }
        }

        // ── Get All Invoices ───────────────────────────────
        public async Task<IEnumerable<InvoiceResponseDto>> GetAsync(
            InvoiceQueryParameter query)
        {
            var collection = _context.Invoice
                .Include(i => i.InvoiceItems)
                    .ThenInclude(ii => ii.FeeHead)
                .Include(i => i.Payments)
                    .ThenInclude(p => p.PaymentMode)
                .Include(i => i.Student)
                    .ThenInclude(s => s.Grade)
                .Include(i => i.Student)
                    .ThenInclude(s => s.Section)
                .AsNoTracking();

            // ── Filters ────────────────────────────────────
            if (query.StudentId.HasValue)
                collection = collection.Where(
                    x => x.StudentId == query.StudentId.Value);

            if (!string.IsNullOrEmpty(query.InvoiceNo))
                collection = collection.Where(
                    x => x.InvoiceNo.Contains(query.InvoiceNo));

            if (query.BillingMonth.HasValue)
                collection = collection.Where(
                    x => x.BillingMonth == query.BillingMonth.Value);

            if (query.AcademicYearId.HasValue)
                collection = collection.Where(
                    x => x.AcademicYearId == query.AcademicYearId.Value);

            if (query.GradeId.HasValue)
                collection = collection.Where(
                    x => x.Student.GradeId == query.GradeId.Value);

            if (!string.IsNullOrEmpty(query.Status) &&
                Enum.TryParse<InvoiceStatus>(
                    query.Status, true, out var statusEnum))
            {
                collection = collection.Where(
                    x => x.Status == statusEnum);
            }

            var invoices = await collection
                .OrderByDescending(x => x.CreatedAt)
                .Skip((query.PageNumber - 1) * query.PageSize)
                .Take(query.PageSize)
                .ToListAsync();

            return invoices.Select(MapToResponse);
        }

        // ── Get Total Count ────────────────────────────────
        public async Task<int> GetTotalCountAsync(
            InvoiceQueryParameter query)
        {
            var collection = _context.Invoice
                .Include(i => i.Student)
                .AsNoTracking()
                .AsQueryable();

            // ── Apply same filters as GetAsync ────────────
            if (query.StudentId.HasValue)
                collection = collection.Where(
                    x => x.StudentId == query.StudentId.Value);

            if (!string.IsNullOrEmpty(query.InvoiceNo))
                collection = collection.Where(
                    x => x.InvoiceNo.Contains(query.InvoiceNo));

            if (query.BillingMonth.HasValue)
                collection = collection.Where(
                    x => x.BillingMonth == query.BillingMonth.Value);

            if (query.AcademicYearId.HasValue)
                collection = collection.Where(
                    x => x.AcademicYearId == query.AcademicYearId.Value);

            if (query.GradeId.HasValue)
                collection = collection.Where(
                    x => x.Student.GradeId == query.GradeId.Value);

            if (!string.IsNullOrEmpty(query.Status) &&
                Enum.TryParse<InvoiceStatus>(
                    query.Status, true, out var statusEnum))
            {
                collection = collection.Where(
                    x => x.Status == statusEnum);
            }

            return await collection.CountAsync();
        }

        // ── Get Invoice By Id ──────────────────────────────
        public async Task<InvoiceResponseDto?> GetByIdAsync(int id)
        {
            var invoice = await _context.Invoice
                .Include(i => i.InvoiceItems)
                    .ThenInclude(ii => ii.FeeHead)
                .Include(i => i.Payments)
                    .ThenInclude(p => p.PaymentMode)
                .Include(i => i.Student)
                    .ThenInclude(s => s.Grade)
                .Include(i => i.Student)
                    .ThenInclude(s => s.Section)
                .AsNoTracking()
                .FirstOrDefaultAsync(i => i.Id == id);

            return invoice == null ? null : MapToResponse(invoice);
        }

        // ── Helper: Map to Response ────────────────────────
        private static InvoiceResponseDto MapToResponse(Invoice i)
        {
            return new InvoiceResponseDto
            {
                Id             = i.Id,
                InvoiceNo      = i.InvoiceNo,
                BillingMonth   = i.BillingMonth,
                StudentId      = i.StudentId,
                StudentName    = i.Student != null
                    ? $"{i.Student.FirstName} {i.Student.LastName}"
                    : null,
                RollNo         = i.Student?.RollNo ?? 0,
                ClassName      = i.Student?.Grade?.Name,
                SectionName    = i.Student?.Section?.SectionName,
                // ✅ Net amount (Base Fee - Discount)
                TotalAmount    = i.TotalAmount,
                DiscountAmount = i.DiscountAmount,
                PreviousDue    = i.PreviousDue,
                PaidAmount     = i.PaidAmount,
                RemainingAmount= i.TotalAmount - i.DiscountAmount + i.PreviousDue - i.PaidAmount,
                TotalPaid      = i.Payments.Sum(p => p.AmountPaid),
                BalanceDue     = i.TotalAmount - i.DiscountAmount + i.PreviousDue - i.PaidAmount,
                Status         = i.Status.ToString(),
                DueDate        = i.DueDate,
                CreatedAt      = i.CreatedAt,
                UpdatedAt      = i.UpdatedAt,

                Items = i.InvoiceItems.Select(it =>
                    new InvoiceItemDto
                    {
                        FeeHeadId   = it.FeeHeadId,
                        FeeHeadName = it.FeeHead?.Name,
                        Description = it.Description,
                        Amount      = it.Amount
                    }).ToList(),

                Payments = i.Payments.Select(p =>
                    new PaymentEntryDto
                    {
                        Id            = p.Id,
                        AmountPaid    = p.AmountPaid,
                        PaymentDate   = p.PaymentDate,
                        PaymentMethod = p.PaymentMode?.Name,
                        ReceiptNo     = p.ReceiptNo,
                        TransactionId = p.TransactionId
                    }).ToList()
            };
        }

        // ── Helper: Generate Invoice Number ───────────────
        private static string GenerateInvoiceNo(
            int studentId,
            int billingMonth,
            int academicYearId)
        {
            return $"SINV-{academicYearId}-{billingMonth:D2}-{studentId}";
        }

        // ── Helper: Generate Receipt Number ───────────────
        private static string GenerateReceiptNo(int invoiceId)
        {
            // Format: SSS-InvoiceID-Timestamp
            // Example: SSS-101-20240522143005
            return $"SSS-RCPT-{invoiceId}-{DateTime.UtcNow:yyyyMMddHHmmss}";
        }
    }
}