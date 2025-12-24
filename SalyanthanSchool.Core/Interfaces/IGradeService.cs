using SalyanthanSchool.Core.DTOs;
using SalyanthanSchool.Core.DTOs.Grade;

namespace SalyanthanSchool.Core.Interfaces
{
    public interface IGradeService
    {
        // Single GET (Paging + Search + Filter + Sort)
        Task<PagedResult<GradeResponseDto>> GetAsync(
            GradeQueryParameter query);

        // GET by ID
        Task<GradeResponseDto?> GetByIdAsync(int id);

        // CREATE
        Task<GradeResponseDto> CreateAsync(GradeRequestDto dto);

        // UPDATE
        Task<GradeResponseDto?> UpdateAsync(
            int id,
            GradeRequestDto dto);

        // DELETE
        Task<bool> DeleteAsync(int id);
    }
}
