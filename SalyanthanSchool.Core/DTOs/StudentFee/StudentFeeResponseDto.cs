using System.Text.Json.Serialization;

namespace SalyanthanSchool.Core.DTOs.StudentFee
{
    // ── Main Response ──────────────────────────────────────
    public class StudentFeeResponseDto
    {
        [JsonPropertyName("student")]
        public StudentInfoDto Student { get; set; } = null!;

        [JsonPropertyName("academic_year")]
        public string AcademicYear { get; set; } = null!;

        // ✅ int instead of string
        [JsonPropertyName("current_month")]
        public int CurrentMonth { get; set; }

        [JsonPropertyName("fee_structure")]
        public FeeStructureDto FeeStructure { get; set; } = null!;

        [JsonPropertyName("discount")]
        public DiscountDto Discount { get; set; } = null!;

        [JsonPropertyName("previous_due")]
        public PreviousDueDto PreviousDue { get; set; } = null!;

        [JsonPropertyName("current_month_payment")]
        public CurrentMonthPaymentDto CurrentMonthPayment { get; set; } = null!;

        [JsonPropertyName("year_summary")]
        public YearSummaryDto YearSummary { get; set; } = null!;

        [JsonPropertyName("payment_history")]
        public List<PaymentHistoryDto> PaymentHistory { get; set; } = new();
    }

    // ── Student Info ───────────────────────────────────────
    public class StudentInfoDto
    {
        [JsonPropertyName("student_id")]
        public int StudentId { get; set; }
    }

    // ── Fee Structure (Dynamic) ────────────────────────────
    [JsonConverter(typeof(FeeStructureDtoConverter))]
    public class FeeStructureDto
    {
        public Dictionary<string, decimal> FeeItems { get; set; }
            = new Dictionary<string, decimal>();

        public decimal BaseAmount { get; set; }
    }

    // ── Discount ───────────────────────────────────────────
    public class DiscountDto
    {
        [JsonPropertyName("type")]
        public string Type { get; set; } = "None";

        [JsonPropertyName("amount")]
        public decimal Amount { get; set; }

        [JsonPropertyName("remarks")]
        public string Remarks { get; set; } = string.Empty;
    }

    // ── Previous Due ───────────────────────────────────────
    public class PreviousDueDto
    {
        [JsonPropertyName("total_due")]
        public decimal TotalDue { get; set; }

        // ✅ int instead of string
        [JsonPropertyName("last_due_month")]
        public int LastDueMonth { get; set; }
    }

    // ── Current Month Payment ──────────────────────────────
    public class CurrentMonthPaymentDto
    {
        [JsonPropertyName("base_amount")]
        public decimal BaseAmount { get; set; }

        [JsonPropertyName("discount")]
        public decimal Discount { get; set; }

        [JsonPropertyName("previous_due")]
        public decimal PreviousDue { get; set; }

        [JsonPropertyName("total_payable")]
        public decimal TotalPayable { get; set; }

        [JsonPropertyName("paid_amount")]
        public decimal PaidAmount { get; set; }

        [JsonPropertyName("remaining_amount")]
        public decimal RemainingAmount { get; set; }

        [JsonPropertyName("status")]
        public string Status { get; set; } = "UNPAID";
    }

    // ── Year Summary ───────────────────────────────────────
    public class YearSummaryDto
    {
        [JsonPropertyName("total_year_fee")]
        public decimal TotalYearFee { get; set; }

        [JsonPropertyName("total_discount")]
        public decimal TotalDiscount { get; set; }

        [JsonPropertyName("total_paid")]
        public decimal TotalPaid { get; set; }

        [JsonPropertyName("total_due")]
        public decimal TotalDue { get; set; }
    }

    // ── Payment History ────────────────────────────────────
    public class PaymentHistoryDto
    {
        [JsonPropertyName("payment_id")]
        public int PaymentId { get; set; }

        // ✅ int instead of string
        [JsonPropertyName("month")]
        public int Month { get; set; }

        [JsonPropertyName("amount")]
        public decimal Amount { get; set; }

        [JsonPropertyName("paid_amount")]
        public decimal PaidAmount { get; set; }

        [JsonPropertyName("status")]
        public string Status { get; set; } = null!;

        [JsonPropertyName("date")]
        public string Date { get; set; } = null!;

        [JsonPropertyName("receipt_no")]
        public string ReceiptNo { get; set; } = string.Empty;

        [JsonPropertyName("method")]
        public string Method { get; set; } = null!;
    }
}