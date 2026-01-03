using SalyanthanSchool.Core.DTOs.FeeStructure;

namespace SalyanthanSchool.Core.Interfaces
{
    public interface IFeeStructureService
    {
        Task<IEnumerable<FeeStructureResponseDto>> GetAsync(FeeStructureQueryParameter query);
        Task<FeeStructureResponseDto?> GetByIdAsync(int id);
        Task<FeeStructureResponseDto> CreateAsync(FeeStructureRequestDto dto);
        Task<FeeStructureResponseDto?> UpdateAsync(int id, FeeStructureRequestDto dto);
        Task<bool> DeleteAsync(int id);
    }
}