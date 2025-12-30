using SalyanthanSchool.Core.DTOs.Common;
using SalyanthanSchool.Core.DTOs.Section;

namespace SalyanthanSchool.Core.Interfaces
{
    public interface ISectionService
    {
        // Single GET (Paging + Search + Filter + Sort)
        Task<PagedResult<SectionResponseDto>> GetAsync(
            SectionQueryParameter query);

        // GET by ID
        Task<SectionResponseDto?> GetByIdAsync(int id);

        // CREATE
        Task<SectionResponseDto> CreateAsync(SectionRequestDto dto);

        // UPDATE
        Task<SectionResponseDto?> UpdateAsync(
            int id,
            SectionRequestDto dto);

        // DELETE
        Task<bool> DeleteAsync(int id);
    }
}