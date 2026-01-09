using SalyanthanSchool.Core.DTOs.Invoice;

namespace SalyanthanSchool.Core.Interfaces
{
    public interface IInvoiceService
    {
        Task<int> GenerateMonthlyInvoicesAsync(GenerateInvoiceDto dto);
        Task<IEnumerable<InvoiceResponseDto>> GetAsync(InvoiceQueryParameter query);
        Task<InvoiceResponseDto?> GetByIdAsync(int id);
        Task<bool> ProcessPaymentAsync(PaymentRequestDto dto);
    }
}