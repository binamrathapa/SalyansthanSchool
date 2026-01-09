using SalyanthanSchool.Core.DTOs.Common;
using SalyanthanSchool.Core.DTOs.Subject;

namespace SalyanthanSchool.Core.Interfaces
{
    public interface ISubjectService
    {
        // Single GET (Paging + Search + Filter + Sort)
        Task<PagedResult<SubjectResponseDto>> GetAsync(
            SubjectQueryParameter query);

        // GET by ID
        Task<SubjectResponseDto?> GetByIdAsync(int id);

        // CREATE
        Task<SubjectResponseDto> CreateAsync(SubjectRequestDto dto);

        // UPDATE
        Task<SubjectResponseDto?> UpdateAsync(
            int id,
            SubjectRequestDto dto);

        // DELETE
        Task<bool> DeleteAsync(int id);
    }
}