using SalyanthanSchool.Core.DTOs.FeeHead;
using SalyanthanSchool.Core.DTOs.Common;

namespace SalyanthanSchool.Core.Interfaces
{
    public interface IFeeHeadService
    {
        Task<PagedResult<FeeHeadResponseDto>> GetAsync(FeeHeadQueryParameter query); Task<FeeHeadResponseDto?> GetByIdAsync(int id);
        Task<FeeHeadResponseDto> CreateAsync(FeeHeadRequestDto dto);
        Task<FeeHeadResponseDto?> UpdateAsync(int id, FeeHeadRequestDto dto);
        Task<bool> DeleteAsync(int id);
    }
}