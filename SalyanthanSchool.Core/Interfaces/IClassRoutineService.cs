using SalyanthanSchool.Core.DTOs.Common;
using SalyanthanSchool.Core.DTOs.ClassRoutine;

namespace SalyanthanSchool.Core.Interfaces
{
    public interface IClassRoutineService
    {
        // GET (Paging + Filter + Sort)
        Task<PagedResult<ClassRoutineResponseDto>> GetAsync(
            ClassRoutineQueryParameter query);

        // GET by ID
        Task<ClassRoutineResponseDto?> GetByIdAsync(int id);

        // CREATE
        Task<ClassRoutineResponseDto> CreateAsync(ClassRoutineRequestDto dto);

        // UPDATE
        Task<ClassRoutineResponseDto?> UpdateAsync(
            int id,
            ClassRoutineRequestDto dto);

        // DELETE
        Task<bool> DeleteAsync(int id);
    }
}