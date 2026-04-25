using SalyanthanSchool.Core.DTOs.Invoice;

namespace SalyanthanSchool.Core.Interfaces
{
    public interface IInvoiceService
    {
        // Generate monthly invoices for all/specific grade
        Task<GenerateInvoiceResultDto> GenerateMonthlyInvoicesAsync(
            GenerateInvoiceDto dto);

        // Get list of invoices
        Task<IEnumerable<InvoiceResponseDto>> GetAsync(
            InvoiceQueryParameter query);

        // Get single invoice
        Task<InvoiceResponseDto?> GetByIdAsync(int id);

        // Process payment with rollback
        Task<PaymentResultDto> ProcessPaymentAsync(
            PaymentRequestDto dto);

        // Rollback/Cancel invoice
        Task<bool> RollbackInvoiceAsync(int invoiceId, string reason);

        // Rollback/Reverse a payment
        Task<bool> RollbackPaymentAsync(int paymentId, string reason);
    }
}