using SalyanthanSchool.Core.DTOs.PaymentMode;

namespace SalyanthanSchool.Core.Interfaces
{
    public interface IPaymentModeService
    {
        Task<IEnumerable<PaymentModeResponseDto>> GetAsync(PaymentModeQueryParameter query);
        Task<PaymentModeResponseDto?> GetByIdAsync(int id);
        Task<PaymentModeResponseDto> CreateAsync(PaymentModeRequestDto dto);
        Task<PaymentModeResponseDto?> UpdateAsync(int id, PaymentModeRequestDto dto);
        Task<bool> DeleteAsync(int id);
    }
}