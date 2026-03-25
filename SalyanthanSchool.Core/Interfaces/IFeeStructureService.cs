using SalyanthanSchool.Core.DTOs.Common;
using SalyanthanSchool.Core.DTOs.FeeStructure;

namespace SalyanthanSchool.Core.Interfaces
{
    public interface IFeeStructureService
    {
        Task<PagedResult<FeeStructureResponseDto>> GetAsync(FeeStructureQueryParameter query);
        Task<FeeStructureResponseDto?> GetByIdAsync(int id);
        Task<FeeStructureResponseDto> CreateAsync(FeeStructureRequestDto dto);
        Task<FeeStructureResponseDto?> UpdateAsync(int id, FeeStructureRequestDto dto);
        Task<bool> DeleteAsync(int id);
    }
}