namespace SalyanthanSchool.Core.DTOs.Invoice
{
    public class PaymentRequestDto
    {
        public int InvoiceId { get; set; }
        public decimal AmountPaid { get; set; }
        public int PaymentModeId { get; set; }
        public string? TransactionId { get; set; }
        public string? Remarks { get; set; }
        public DateTime PaymentDate { get; set; } = DateTime.Now;
    }
}