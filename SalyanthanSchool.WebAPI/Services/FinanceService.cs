using Microsoft.EntityFrameworkCore;
using SalyanthanSchool.Core.DTOs.Finance;
using SalyanthanSchool.Core.Entities;
using SalyanthanSchool.Core.Interfaces;
using SalyanthanSchool.WebAPI.Data;
using System.Globalization;

namespace SalyanthanSchool.WebAPI.Services
{
    public class FinanceService : IFinanceService
    {
        private readonly SalyanthanSchoolWebAPIContext _context;

        public FinanceService(SalyanthanSchoolWebAPIContext context)
        {
            _context = context;
        }

        public async Task<FinanceDashboardDto> GetFinanceDashboardDataAsync(int? year = null)
        {
            int targetYear = year ?? DateTime.UtcNow.Year;
            var today = DateTime.UtcNow.Date;

            var dashboard = new FinanceDashboardDto
            {
                AvailableYears = await _context.StudentPayment
                    .Select(p => p.PaymentDate.Year)
                    .Distinct()
                    .OrderBy(y => y)
                    .ToListAsync(),
                Year = targetYear
            };

            if (!dashboard.AvailableYears.Contains(targetYear))
            {
                dashboard.AvailableYears.Add(targetYear);
                dashboard.AvailableYears = dashboard.AvailableYears.OrderBy(y => y).ToList();
            }

            // 1. Today's Collection
            var todayPayments = await _context.StudentPayment
                .Where(p => p.PaymentDate.Date == today && p.Status == PaymentStatus.Completed)
                .SumAsync(p => p.AmountPaid);

            dashboard.Data.TodayCollection = new TodayCollectionDto
            {
                Date = today.ToString("yyyy-MM-dd"),
                Amount = todayPayments,
                Status = "Open"
            };

            // 2. Weekly Collection (Last 7 days including today)
            var weekDays = new[] { "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun" };
            var startOfWeek = today.AddDays(-(int)today.DayOfWeek + (int)DayOfWeek.Monday);
            if (today.DayOfWeek == DayOfWeek.Sunday) startOfWeek = today.AddDays(-6);

            for (int i = 0; i < 7; i++)
            {
                var currentDay = startOfWeek.AddDays(i);
                var amount = await _context.StudentPayment
                    .Where(p => p.PaymentDate.Date == currentDay && p.Status == PaymentStatus.Completed)
                    .SumAsync(p => p.AmountPaid);

                dashboard.Data.WeeklyCollection.Add(new WeeklyCollectionDto
                {
                    Label = weekDays[i],
                    Amount = amount,
                    DayIndex = (int)currentDay.DayOfWeek
                });
            }

            // 3. Monthly Collection (Split into 4 weeks)
            for (int i = 1; i <= 4; i++)
            {
                var startDay = (i - 1) * 7 + 1;
                var endDay = i == 4 ? DateTime.DaysInMonth(targetYear, today.Month) : i * 7;
                
                var amount = await _context.StudentPayment
                    .Where(p => p.PaymentDate.Year == targetYear && 
                                p.PaymentDate.Month == today.Month && 
                                p.PaymentDate.Day >= startDay && 
                                p.PaymentDate.Day <= endDay &&
                                p.Status == PaymentStatus.Completed)
                    .SumAsync(p => p.AmountPaid);

                dashboard.Data.MonthlyCollection.Add(new MonthlyCollectionDto
                {
                    Label = $"Week {i}",
                    Amount = amount
                });
            }

            // 4. Yearly Collection (Jan to Dec)
            var months = DateTimeFormatInfo.InvariantInfo.AbbreviatedMonthNames;
            for (int i = 1; i <= 12; i++)
            {
                var amount = await _context.StudentPayment
                    .Where(p => p.PaymentDate.Year == targetYear && p.PaymentDate.Month == i && p.Status == PaymentStatus.Completed)
                    .SumAsync(p => p.AmountPaid);

                dashboard.Data.YearlyCollection.Add(new YearlyCollectionDto
                {
                    Label = months[i - 1],
                    Amount = amount,
                    MonthIndex = i - 1
                });
            }

            // 5. Defaulters (Top 10 by amount)
            var defaulters = await _context.Invoice
                .Where(i => i.Status == InvoiceStatus.Unpaid || i.Status == InvoiceStatus.Partial)
                .Include(i => i.Student)
                .ThenInclude(s => s.Grade)
                .OrderByDescending(i => i.RemainingAmount)
                .Take(10)
                .Select(i => new DefaulterDto
                {
                    Id = i.Student.Id.ToString(),
                    Name = $"{i.Student.FirstName} {i.Student.LastName}",
                    Class = i.Student.Grade.Name,
                    DueAmount = i.RemainingAmount,
                    Status = i.Status.ToString(),
                    Contact = i.Student.GuardianContact
                })
                .ToListAsync();

            dashboard.Data.Defaulters = defaulters;

            // 6. Latest Transactions
            var latestTransactions = await _context.StudentPayment
                .Include(p => p.Student)
                .ThenInclude(s => s.Grade)
                .Include(p => p.PaymentMode)
                .OrderByDescending(p => p.PaymentDate)
                .Take(10)
                .Select(p => new TransactionDto
                {
                    Receipt = p.TransactionId ?? p.ReceiptNo ?? $"RCPT{p.Id}",
                    Student = $"{p.Student.FirstName} {p.Student.LastName}",
                    Class = p.Student.Grade.Name,
                    Amount = p.AmountPaid,
                    Date = p.PaymentDate.ToString("yyyy-MM-dd"),
                    Method = p.PaymentMode.Name,
                    Status = "Success"
                })
                .ToListAsync();

            dashboard.Data.LatestestTrasaction = latestTransactions;

            // 7. Previous Years Aggregate
            dashboard.PreviousYearsAggregate = await _context.StudentPayment
                .Where(p => p.Status == PaymentStatus.Completed && p.PaymentDate.Year < targetYear)
                .GroupBy(p => p.PaymentDate.Year)
                .Select(g => new YearlyAggregateDto
                {
                    Year = g.Key,
                    TotalCollection = g.Sum(p => p.AmountPaid)
                })
                .OrderBy(y => y.Year)
                .ToListAsync();

            // 8. Class Wise Fee Status
            dashboard.ClassWiseFeeStatus = await _context.Invoice
                .GroupBy(i => i.Student.Grade.Name)
                .Select(g => new ClassWiseFeeStatusDto
                {
                    Class = g.Key,
                    PaidAmount = g.Sum(i => i.PaidAmount),
                    UnpaidAmount = g.Sum(i => i.RemainingAmount)
                })
                .ToListAsync();

            return dashboard;
        }
    }
}
