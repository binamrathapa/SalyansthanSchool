using System;
using System.Collections.Generic;

namespace SalyanthanSchool.Core.DTOs.Finance
{
    public class FinanceDashboardDto
    {
        public List<int> AvailableYears { get; set; } = new();
        public int Year { get; set; }
        public FinanceDataDto Data { get; set; } = new();
        public List<YearlyAggregateDto> PreviousYearsAggregate { get; set; } = new();
        public List<ClassWiseFeeStatusDto> ClassWiseFeeStatus { get; set; } = new();
    }

    public class FinanceDataDto
    {
        public TodayCollectionDto TodayCollection { get; set; } = new();
        public List<WeeklyCollectionDto> WeeklyCollection { get; set; } = new();
        public List<MonthlyCollectionDto> MonthlyCollection { get; set; } = new();
        public List<YearlyCollectionDto> YearlyCollection { get; set; } = new();
        public List<DefaulterDto> Defaulters { get; set; } = new();
        public List<TransactionDto> LatestestTrasaction { get; set; } = new();
    }

    public class TodayCollectionDto
    {
        public string Date { get; set; } = null!;
        public decimal Amount { get; set; }
        public string Status { get; set; } = "Open";
    }

    public class WeeklyCollectionDto
    {
        public string Label { get; set; } = null!;
        public decimal Amount { get; set; }
        public int DayIndex { get; set; }
    }

    public class MonthlyCollectionDto
    {
        public string Label { get; set; } = null!;
        public decimal Amount { get; set; }
    }

    public class YearlyCollectionDto
    {
        public string Label { get; set; } = null!;
        public decimal Amount { get; set; }
        public int MonthIndex { get; set; }
    }

    public class DefaulterDto
    {
        public string Id { get; set; } = null!;
        public string Name { get; set; } = null!;
        public string Class { get; set; } = null!;
        public decimal DueAmount { get; set; }
        public string? LastPayment { get; set; }
        public string Status { get; set; } = null!;
        public string? Contact { get; set; }
    }

    public class TransactionDto
    {
        public string Receipt { get; set; } = null!;
        public string Student { get; set; } = null!;
        public string Class { get; set; } = null!;
        public decimal Amount { get; set; }
        public string Date { get; set; } = null!;
        public string Method { get; set; } = null!;
        public string Status { get; set; } = "Success";
    }

    public class YearlyAggregateDto
    {
        public int Year { get; set; }
        public decimal TotalCollection { get; set; }
    }

    public class ClassWiseFeeStatusDto
    {
        public string Class { get; set; } = null!;
        public decimal PaidAmount { get; set; }
        public decimal UnpaidAmount { get; set; }
    }
}
