using SalyanthanSchool.Core.DTOs.FeeHead;

namespace SalyanthanSchool.Core.Interfaces
{
    public interface IFeeHeadService
    {
        Task<IEnumerable<FeeHeadResponseDto>> GetAsync(FeeHeadQueryParameter query);
        Task<FeeHeadResponseDto?> GetByIdAsync(int id);
        Task<FeeHeadResponseDto> CreateAsync(FeeHeadRequestDto dto);
        Task<FeeHeadResponseDto?> UpdateAsync(int id, FeeHeadRequestDto dto);
        Task<bool> DeleteAsync(int id);
    }
}