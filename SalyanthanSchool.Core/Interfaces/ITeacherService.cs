using System.Threading.Tasks;
using SalyanthanSchool.Core.DTOs;
using System.Collections.Generic;

namespace SalyanthanSchool.Core.Interfaces
{
    public interface ITeacherService
    {
        Task<IEnumerable<TeacherDTO>> GetAllAsync();
        Task<TeacherDTO?> GetByIdAsync(int id);
        Task<TeacherDTO> CreateAsync(TeacherDTO dto);
        Task<TeacherDTO?> UpdateAsync(int id, TeacherDTO dto);
        Task<bool> DeleteAsync(int id);
        Task<PagedResult<TeacherDTO>> GetPagedAsync(int pageNumber, int pageSize);
    }
}
