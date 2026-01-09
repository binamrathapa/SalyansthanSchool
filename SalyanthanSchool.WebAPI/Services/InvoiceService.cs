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

        public InvoiceService(SalyanthanSchoolWebAPIContext context)
        {
            _context = context;
        }

        public async Task<int> GenerateMonthlyInvoicesAsync(GenerateInvoiceDto dto)
        {
            var students = await _context.Student
                .Where(s => s.IsActive == true && (!dto.GradeId.HasValue || s.GradeId == dto.GradeId))
                .ToListAsync();

            int count = 0;

            foreach (var student in students)
            {
                bool exists = await _context.Invoice.AnyAsync(i =>
                    i.StudentId == student.Id &&
                    i.BillingMonth == dto.BillingMonth &&
                    i.AcademicYearId == dto.AcademicYearId);

                if (exists) continue;

                var fees = await _context.FeeStructure.Include(f => f.FeeHead)
                    .Where(f => f.GradeId == student.GradeId &&
                                f.AcademicYearId == dto.AcademicYearId)
                    .ToListAsync();

                var discounts = await _context.StudentDiscount
                    .Where(d => d.StudentId == student.Id).ToListAsync();

                // CARRY FORWARD CALCULATION
                var totalInvoiced = await _context.Invoice.Where(i => i.StudentId == student.Id).SumAsync(i => i.TotalAmount);
                var totalPaidToDate = await _context.StudentPayment.Where(p => p.StudentId == student.Id).SumAsync(p => p.AmountPaid);
                decimal balanceForward = totalInvoiced - totalPaidToDate;

                var invoice = new Invoice
                {
                    StudentId = student.Id,
                    AcademicYearId = dto.AcademicYearId,
                    BillingMonth = dto.BillingMonth,
                    InvoiceNo = $"INV-{dto.BillingMonth}{DateTime.Now.Year % 100}-{student.Id}",
                    DueDate = dto.DueDate,
                    Status = InvoiceStatus.Unpaid,
                    CreatedAt = DateTime.UtcNow
                };

                decimal currentMonthTotal = 0;

                foreach (var f in fees)
                {
                    var discAmount = discounts.FirstOrDefault(d => d.FeeHeadId == f.FeeHeadId)?.DiscountAmount ?? 0;
                    decimal finalAmount = f.Amount - discAmount;

                    invoice.InvoiceItems.Add(new InvoiceItem
                    {
                        FeeHeadId = f.FeeHeadId,
                        Amount = finalAmount,
                        Description = f.FeeHead.Name
                    });
                    currentMonthTotal += finalAmount;
                }

                if (balanceForward > 0)
                {
                    invoice.InvoiceItems.Add(new InvoiceItem
                    {
                        FeeHeadId = fees.FirstOrDefault()?.FeeHeadId ?? 1,
                        Amount = balanceForward,
                        Description = "Previous Outstanding Balance (Arrears)"
                    });
                    currentMonthTotal += balanceForward;
                }

                invoice.TotalAmount = currentMonthTotal;
                if (invoice.TotalAmount > 0) { _context.Invoice.Add(invoice); count++; }
            }

            await _context.SaveChangesAsync();
            return count;
        }

        // REMOVED DUPLICATE - ONLY ONE VERSION REMAINS BELOW
        public async Task<bool> ProcessPaymentAsync(PaymentRequestDto dto)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var invoice = await _context.Invoice
                    .Include(i => i.Payments)
                    .FirstOrDefaultAsync(x => x.Id == dto.InvoiceId);

                // FEATURE: LOCK INVOICE IF PAID
                if (invoice == null || invoice.Status == InvoiceStatus.Paid) return false;

                var payment = new StudentPayment
                {
                    InvoiceId = dto.InvoiceId,
                    StudentId = invoice.StudentId,
                    AmountPaid = dto.AmountPaid,
                    PaymentDate = dto.PaymentDate,
                    PaymentModeId = dto.PaymentModeId,
                    TransactionId = dto.TransactionId,
                    CreatedAt = DateTime.UtcNow
                };

                _context.StudentPayment.Add(payment);

                var totalPaidSoFar = invoice.Payments.Sum(p => p.AmountPaid) + dto.AmountPaid;

                if (totalPaidSoFar >= invoice.TotalAmount)
                    invoice.Status = InvoiceStatus.Paid;
                else if (totalPaidSoFar > 0)
                    invoice.Status = InvoiceStatus.Partial;

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
                return true;
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();
                return false;
            }
        }

        public async Task<IEnumerable<InvoiceResponseDto>> GetAsync(InvoiceQueryParameter query)
        {
            var collection = _context.Invoice.Include(i => i.InvoiceItems).Include(i => i.Payments).AsNoTracking();

            if (query.StudentId.HasValue) collection = collection.Where(x => x.StudentId == query.StudentId);
            if (!string.IsNullOrEmpty(query.InvoiceNo)) collection = collection.Where(x => x.InvoiceNo.Contains(query.InvoiceNo));

            return await collection
                .OrderByDescending(x => x.CreatedAt)
                .Skip((query.PageNumber - 1) * query.PageSize)
                .Take(query.PageSize)
                .Select(i => new InvoiceResponseDto
                {
                    Id = i.Id,
                    InvoiceNo = i.InvoiceNo,
                    TotalAmount = i.TotalAmount,
                    TotalPaid = i.Payments.Sum(p => p.AmountPaid),
                    BalanceDue = i.TotalAmount - i.Payments.Sum(p => p.AmountPaid),
                    Status = i.Status.ToString(),
                    Items = i.InvoiceItems.Select(it => new InvoiceItemDto { Description = it.Description, Amount = it.Amount }).ToList()
                }).ToListAsync();
        }

        public async Task<InvoiceResponseDto?> GetByIdAsync(int id)
        {
            return await _context.Invoice.Include(i => i.InvoiceItems).Include(i => i.Payments)
                .Select(i => new InvoiceResponseDto
                {
                    Id = i.Id,
                    InvoiceNo = i.InvoiceNo,
                    TotalAmount = i.TotalAmount,
                    TotalPaid = i.Payments.Sum(p => p.AmountPaid),
                    BalanceDue = i.TotalAmount - i.Payments.Sum(p => p.AmountPaid),
                    Status = i.Status.ToString(),
                    Items = i.InvoiceItems.Select(it => new InvoiceItemDto { Description = it.Description, Amount = it.Amount }).ToList()
                }).FirstOrDefaultAsync(x => x.Id == id);
        }
    }
}