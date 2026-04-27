using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace SalyanthanSchool.Core.DTOs.Dashboard
{
    public class DashboardDto
    {
        public List<MetricDto> Metrics { get; set; } = new();
        public ChartsDto Charts { get; set; } = new();
        public FinancialsDto Financials { get; set; } = new();
    }

    public class MetricDto
    {
        public string Id { get; set; } = null!;
        public string Title { get; set; } = null!;
        public object Value { get; set; } = null!;
        public string? Description { get; set; }

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public TrendDto? Trend { get; set; }
    }

    public class TrendDto
    {
        public decimal Value { get; set; }
        public bool IsPositive { get; set; }
    }

    public class ChartsDto
    {
        public List<EnrollmentChartDto> Enrollment { get; set; } = new();
        public List<GenderChartDto> Gender { get; set; } = new();
    }

    public class EnrollmentChartDto
    {
        public string Name { get; set; } = null!;
        public decimal Value { get; set; }
    }

    public class GenderChartDto
    {
        public string Name { get; set; } = null!;
        public decimal Value { get; set; }
    }

    public class FinancialsDto
    {
        public CollectionSummaryDto Collections { get; set; } = new();
        public PendingDuesDto PendingDues { get; set; } = new();
        public List<decimal> WeeklyHistory { get; set; } = new();
    }

    public class CollectionSummaryDto
    {
        public decimal Daily { get; set; }
        public decimal Weekly { get; set; }
        public decimal Monthly { get; set; }
    }

    public class PendingDuesDto
    {
        public decimal Amount { get; set; }
        public int Count { get; set; }
    }
}
