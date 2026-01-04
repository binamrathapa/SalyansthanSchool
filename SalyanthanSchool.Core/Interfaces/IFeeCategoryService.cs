using SalyanthanSchool.Core.DTOs.Account.FeeCategory;
using SalyanthanSchool.Core.DTOs.FeeCategory;
using SalyanthanSchool.Core.DTOs.FeeCategory.SalyanthanSchool.Core.DTOs.Account.FeeCategory;

namespace SalyanthanSchool.Core.Interfaces
{
    public interface IFeeCategoryService
    {
        Task<IEnumerable<FeeCategoryResponseDto>> GetAllAsync(FeeCategoryQueryParameter query);

        Task<FeeCategoryResponseDto?> GetByIdAsync(int id);
        Task<FeeCategoryResponseDto> CreateAsync(FeeCategoryRequestDto dto);
        Task<FeeCategoryResponseDto?> UpdateAsync(int id, FeeCategoryRequestDto dto);

        Task<bool> PatchAsync(int id, string name);
        Task<bool> DeleteAsync(int id);
    }
}