namespace SalyanthanSchool.Core.DTOs.Invoice
{
    public class InvoiceResponseDto
    {
        public int Id { get; set; }
        public string InvoiceNo { get; set; } = null!;
        public decimal TotalAmount { get; set; }
        public decimal TotalPaid { get; set; }
        public decimal BalanceDue { get; set; }
        public string Status { get; set; } = null!; 
        public DateTime DueDate { get; set; }
        public List<InvoiceItemDto> Items { get; set; } = new();
    }

    public class InvoiceItemDto
    {
        public string? Description { get; set; }
        public decimal Amount { get; set; }
    }
}