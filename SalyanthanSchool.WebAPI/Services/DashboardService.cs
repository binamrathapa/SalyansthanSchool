using Microsoft.EntityFrameworkCore;
using SalyanthanSchool.Core.DTOs.Dashboard;
using SalyanthanSchool.Core.Entities;
using SalyanthanSchool.Core.Interfaces;
using SalyanthanSchool.WebAPI.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SalyanthanSchool.WebAPI.Services
{
    public class DashboardService : IDashboardService
    {
        private readonly SalyanthanSchoolWebAPIContext _context;

        public DashboardService(SalyanthanSchoolWebAPIContext context)
        {
            _context = context;
        }

        public async Task<DashboardDto> GetDashboardDataAsync()
        {
            // Use local school time logic or UTC depending on how data is stored
            // To be safe, we calculate start of days
            var now = DateTime.UtcNow;
            var todayStart = now.Date;
            var sevenDaysAgoStart = now.AddDays(-7).Date;
            var thirtyDaysAgoStart = now.AddDays(-30).Date;

            // 1. Basic Counts
            var totalStudents = await _context.Student.CountAsync(s => s.IsActive);
            var totalTeachers = await _context.Teachers.CountAsync(t => t.IsActive);
            var totalClasses  = await _context.Grade.CountAsync();
            
            // Trends (Current Total vs. Total 30 Days Ago)
            var students30DaysAgo = await _context.Student
                .CountAsync(s => s.IsActive && s.CreatedAt < thirtyDaysAgoStart);
            
            var teachers30DaysAgo = await _context.Teachers
                .CountAsync(t => t.IsActive && t.CreatedAt < thirtyDaysAgoStart);

            // 2. Financial Metrics - Summing payments
            // Note: We use >= Start of day to ensure we catch all payments made 'today'
            var dailyCollection = await _context.StudentPayment
                .Where(p => p.Status == PaymentStatus.Completed && p.PaymentDate >= todayStart)
                .SumAsync(p => p.AmountPaid);

            var weeklyCollection = await _context.StudentPayment
                .Where(p => p.Status == PaymentStatus.Completed && p.PaymentDate >= sevenDaysAgoStart)
                .SumAsync(p => p.AmountPaid);

            var monthlyCollection = await _context.StudentPayment
                .Where(p => p.Status == PaymentStatus.Completed && p.PaymentDate >= thirtyDaysAgoStart)
                .SumAsync(p => p.AmountPaid);

            var pendingInvoices = await _context.Invoice
                .Where(i => i.Status == InvoiceStatus.Unpaid || i.Status == InvoiceStatus.Partial)
                .ToListAsync();

            var pendingAmount = pendingInvoices.Sum(i => i.RemainingAmount);
            var pendingCount  = pendingInvoices.Count;

            // 3. Weekly History (Last 7 days)
            var weeklyHistory = new List<decimal>();
            for (int i = 6; i >= 0; i--)
            {
                var date = todayStart.AddDays(-i);
                var nextDate = date.AddDays(1);
                var dayTotal = await _context.StudentPayment
                    .Where(p => p.Status == PaymentStatus.Completed && p.PaymentDate >= date && p.PaymentDate < nextDate)
                    .SumAsync(p => p.AmountPaid);
                weeklyHistory.Add(dayTotal);
            }

            // 4. Charts Data
            var enrollmentByGrade = await _context.Student
                .Include(s => s.Grade)
                .GroupBy(s => s.Grade.Name)
                .Select(g => new EnrollmentChartDto
                {
                    Name = g.Key,
                    Value = g.Count()
                })
                .ToListAsync();

            var genderRatio = await _context.Student
                .GroupBy(s => s.Gender)
                .Select(g => new GenderChartDto
                {
                    Name = g.Key,
                    Value = g.Count()
                })
                .ToListAsync();

            // 5. Build DTO
            var dto = new DashboardDto
            {
                Metrics = new List<MetricDto>
                {
                    new MetricDto
                    {
                        Id = "students",
                        Title = "Total Students",
                        Value = totalStudents,
                        Description = "Active students in current session",
                        Trend = CalculateTrend(totalStudents, students30DaysAgo)
                    },
                    new MetricDto
                    {
                        Id = "teachers",
                        Title = "Total Teachers",
                        Value = totalTeachers,
                        Description = "Active faculty members",
                        Trend = CalculateTrend(totalTeachers, teachers30DaysAgo)
                    },
                    new MetricDto
                    {
                        Id = "classes",
                        Title = "Total Classes",
                        Value = totalClasses,
                        Description = "Grades and Levels"
                    }
                },
                Charts = new ChartsDto
                {
                    Enrollment = enrollmentByGrade,
                    Gender = genderRatio
                },
                Financials = new FinancialsDto
                {
                    Collections = new CollectionSummaryDto
                    {
                        Daily = dailyCollection,
                        Weekly = weeklyCollection,
                        Monthly = monthlyCollection
                    },
                    PendingDues = new PendingDuesDto
                    {
                        Amount = pendingAmount,
                        Count = pendingCount
                    },
                    WeeklyHistory = weeklyHistory
                }
            };

            return dto;
        }

        private TrendDto? CalculateTrend(decimal current, decimal previous)
        {
            if (previous == 0) return current > 0 ? new TrendDto { Value = 100, IsPositive = true } : null;

            var diff = current - previous;
            var percent = (diff / previous) * 100;

            return new TrendDto
            {
                Value = Math.Round(Math.Abs(percent), 1),
                IsPositive = diff >= 0
            };
        }
    }
}
