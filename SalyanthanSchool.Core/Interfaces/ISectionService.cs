using SalyanthanSchool.Core.DTOs.Common;
using SalyanthanSchool.Core.DTOs.Section;

namespace SalyanthanSchool.Core.Interfaces
{
    public interface ISectionService
    {
        Task<PagedResult<SectionResponseDto>> GetAsync(SectionQueryParameter query);
        Task<SectionResponseDto?> GetByIdAsync(int id);
        Task<SectionResponseDto> CreateAsync(SectionRequestDto dto);
        Task<SectionResponseDto?> UpdateAsync(int id, SectionRequestDto dto);
        Task<bool> DeleteAsync(int id);
    }
}