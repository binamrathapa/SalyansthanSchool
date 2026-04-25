namespace SalyanthanSchool.Core.DTOs.Invoice
{
    // ── Invoice Response ───────────────────────────────────
    public class InvoiceResponseDto
    {
        public int      Id            { get; set; }
        public string   InvoiceNo     { get; set; } = null!;
        public int?     BillingMonth  { get; set; }
        public int      StudentId     { get; set; }
        public string?  StudentName   { get; set; }
        public int      RollNo        { get; set; }
        public string?  ClassName     { get; set; }
        public string?  SectionName   { get; set; }
        public decimal  TotalAmount   { get; set; }
        public decimal  DiscountAmount{ get; set; }
        public decimal  PreviousDue   { get; set; }
        public decimal  PaidAmount    { get; set; }
        public decimal  RemainingAmount { get; set; }
        public decimal  TotalPaid     { get; set; }
        public decimal  BalanceDue    { get; set; }
        public string   Status        { get; set; } = null!;
        public DateTime DueDate       { get; set; }
        public DateTime CreatedAt     { get; set; }
        public DateTime? UpdatedAt    { get; set; }

        public List<InvoiceItemDto>  Items    { get; set; } = new();
        public List<PaymentEntryDto> Payments { get; set; } = new();
    }

    // ── Invoice Item ───────────────────────────────────────
    public class InvoiceItemDto
    {
        public int     FeeHeadId   { get; set; }
        public string? FeeHeadName { get; set; }
        public string? Description { get; set; }
        public decimal Amount      { get; set; }
    }

    // ── Payment Entry ──────────────────────────────────────
    public class PaymentEntryDto
    {
        public int      Id            { get; set; }
        public decimal  AmountPaid    { get; set; }
        public DateTime PaymentDate   { get; set; }
        public string?  PaymentMethod { get; set; }
        public string?  ReceiptNo     { get; set; }
        public string?  TransactionId { get; set; }
    }

    // ── Generate Result ────────────────────────────────────
    public class GenerateInvoiceResultDto
    {
        public int    InvoicesCreated  { get; set; }
        public int    InvoicesSkipped  { get; set; }
        public int    BillingMonth     { get; set; }
        public string Message          { get; set; } = null!;
        public List<string> Errors     { get; set; } = new();
    }

    // ── Payment Result ─────────────────────────────────────
    public class PaymentResultDto
    {
        public bool    Success         { get; set; }
        public string  Message         { get; set; } = null!;
        public string? NewStatus       { get; set; }
        public decimal PaidAmount      { get; set; }
        public decimal RemainingAmount { get; set; }
        public string? ReceiptNo       { get; set; }
    }
}