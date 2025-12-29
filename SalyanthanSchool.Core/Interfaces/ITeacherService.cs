using SalyanthanSchool.Core.DTOs.Common;
using SalyanthanSchool.Core.DTOs.Teacher;

namespace SalyanthanSchool.Core.Interfaces
{
    public interface ITeacherService
    {
        // Single GET (Paging + Search + Filter + Sort)
        Task<PagedResult<TeacherResponseDto>> GetAsync(
            TeacherQueryParameter query);

        // GET by ID
        Task<TeacherResponseDto?> GetByIdAsync(int id);

        // CREATE
        Task<TeacherResponseDto> CreateAsync(TeacherRequestDto dto);

        // UPDATE
        Task<TeacherResponseDto?> UpdateAsync(
            int id,
            TeacherRequestDto dto);

        // DELETE
        Task<bool> DeleteAsync(int id);
    }
}