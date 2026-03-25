using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SalyanthanSchool.Core.Entities
{
    public enum InvoiceStatus
    {
        Unpaid    = 0,
        Paid      = 1,
        Partial   = 2,
        Overdue   = 3,
        Cancelled = 4
    }

    [Table("Invoice")]
    public class Invoice
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("student_id")]
        public int StudentId { get; set; }

        [Column("academic_year_id")]
        public int AcademicYearId { get; set; }

        [Column("invoice_no")]
        public string InvoiceNo { get; set; } = null!;

        [Column("billing_month")]
        public int? BillingMonth { get; set; }

        [Column("total_amount")]
        public decimal TotalAmount { get; set; }

        [Column("due_date")]
        public DateTime DueDate { get; set; }

        // Uses enum directly - no FK needed
        [Column("status")]
        public InvoiceStatus Status { get; set; }
            = InvoiceStatus.Unpaid;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // ⭐ New columns
        [Column("discount_amount")]
        public decimal DiscountAmount { get; set; } = 0;

        [Column("previous_due")]
        public decimal PreviousDue { get; set; } = 0;

        [Column("paid_amount")]
        public decimal PaidAmount { get; set; } = 0;

        [Column("remaining_amount")]
        public decimal RemainingAmount { get; set; } = 0;

        [Column("receipt_no")]
        public string? ReceiptNo { get; set; }

        [Column("updated_at")]
        public DateTime? UpdatedAt { get; set; }

        // Navigation
        [ForeignKey("StudentId")]
        public virtual Student Student { get; set; } = null!;

        [ForeignKey("AcademicYearId")]
        public virtual AcademicYear AcademicYear { get; set; } = null!;

        public virtual ICollection<InvoiceItem> InvoiceItems { get; set; }
            = new List<InvoiceItem>();

        public virtual ICollection<StudentPayment> Payments { get; set; }
            = new List<StudentPayment>();
    }

    // ── Invoice Item ───────────────────────────────────────
    [Table("Invoice_Item")]
    public class InvoiceItem
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("invoice_id")]
        public int InvoiceId { get; set; }

        [Column("fee_head_id")]
        public int FeeHeadId { get; set; }

        [Column("description")]
        public string? Description { get; set; }

        [Column("amount")]
        public decimal Amount { get; set; }

        [ForeignKey("InvoiceId")]
        public virtual Invoice Invoice { get; set; } = null!;

        [ForeignKey("FeeHeadId")]
        public virtual FeeHead FeeHead { get; set; } = null!;
    }

    // ── Student Payment ────────────────────────────────────
    [Table("Student_Payment")]
    public class StudentPayment
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("student_id")]
        public int StudentId { get; set; }

        [Column("invoice_id")]
        public int InvoiceId { get; set; }

        [Column("amount")]
        public decimal AmountPaid { get; set; }

        [Column("payment_date")]
        public DateTime PaymentDate { get; set; }

        [Column("payment_mode_id")]
        public int PaymentModeId { get; set; }

        [Column("reference_no")]
        public string? TransactionId { get; set; }

        [Column("created_at")]
        public DateTime? CreatedAt { get; set; }

        // New column
        [Column("receipt_no")]
        public string? ReceiptNo { get; set; }

        [NotMapped]
        public string? Remarks { get; set; }

        // Navigation
        [ForeignKey("StudentId")]
        public virtual Student Student { get; set; } = null!;

        [ForeignKey("InvoiceId")]
        public virtual Invoice Invoice { get; set; } = null!;

        [ForeignKey("PaymentModeId")]
        public virtual PaymentMode PaymentMode { get; set; } = null!;
    }
}