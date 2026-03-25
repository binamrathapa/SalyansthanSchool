using SalyanthanSchool.Core.DTOs.AcademicYear;
using SalyanthanSchool.Core.DTOs.Common;

namespace SalyanthanSchool.Core.Interfaces
{
    public interface IAcademicYearService
    {
        Task<PagedResult<AcademicYearResponseDto>> GetAllAsync(AcademicYearQueryParameter query);
        Task<AcademicYearResponseDto?> GetByIdAsync(int id);
        Task<AcademicYearResponseDto> CreateAsync(AcademicYearRequestDto dto);
        Task<AcademicYearResponseDto?> UpdateAsync(int id, AcademicYearRequestDto dto);
        Task<AcademicYearResponseDto?> PatchAsync(int id, AcademicYearPatchDto dto);
        Task<bool> DeleteAsync(int id);
    }
}