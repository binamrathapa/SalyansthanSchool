using System.Collections.Generic;
using System.Threading.Tasks;
using SalyanthanSchool.Core.DTOs;

namespace SalyanthanSchool.Core.Interfaces
{
    public interface IGradeService
    {
        Task<IEnumerable<GradeDto>> GetAllAsync();
        Task<GradeDto?> GetByIdAsync(int id);
        Task<GradeDto> CreateAsync(GradeDto dto);
        Task<GradeDto?> UpdateAsync(int id, GradeDto dto);
        Task<bool> DeleteAsync(int id);

        // pagination
        Task<PagedResult<GradeDto>> GetPagedAsync(int pageNumber, int pageSize = 30);
    }
}
