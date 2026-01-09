using SalyanthanSchool.Core.DTOs.AcademicYear;

namespace SalyanthanSchool.Core.Interfaces
{
    public interface IAcademicYearService
    {
        Task<IEnumerable<AcademicYearResponseDto>> GetAllAsync();
        Task<AcademicYearResponseDto?> GetByIdAsync(int id);
        Task<AcademicYearResponseDto> CreateAsync(AcademicYearRequestDto dto);
        Task<AcademicYearResponseDto?> UpdateAsync(int id, AcademicYearRequestDto dto);
        Task<AcademicYearResponseDto?> PatchAsync(int id, AcademicYearPatchDto dto);
        Task<bool> DeleteAsync(int id);
    }
}