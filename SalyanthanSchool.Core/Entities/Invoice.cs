using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SalyanthanSchool.Core.Entities
{
    public enum InvoiceStatus { Unpaid = 0, Partial = 1, Paid = 2 }

    [Table("Invoice")]
    public class Invoice
    {
        [Key]
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

        [Column("status")]
        public InvoiceStatus Status { get; set; } = InvoiceStatus.Unpaid;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public virtual ICollection<InvoiceItem> InvoiceItems { get; set; } = new List<InvoiceItem>();
        public virtual ICollection<StudentPayment> Payments { get; set; } = new List<StudentPayment>();
    }

    [Table("Invoice_Item")]
    public class InvoiceItem
    {
        [Key]
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
    }

    [Table("Student_Payment")] 
    public class StudentPayment
    {
        [Key]
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

        [NotMapped] 
        public string? Remarks { get; set; }

        [ForeignKey("InvoiceId")]
        public virtual Invoice Invoice { get; set; } = null!;

    }
}