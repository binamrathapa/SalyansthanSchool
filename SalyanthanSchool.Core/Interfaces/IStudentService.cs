using System.Collections.Generic;
using System.Threading.Tasks;
using SalyanthanSchool.Core.DTOs;

namespace SalyanthanSchool.Core.Interfaces
{
    public interface IStudentService
    {
        Task<IEnumerable<StudentDto>> GetAllAsync();
        Task<StudentDto?> GetByIdAsync(int id);
        Task<StudentDto> CreateAsync(StudentDto dto);
        Task<StudentDto?> UpdateAsync(int id, StudentDto dto);
        Task<bool> DeleteAsync(int id);
        Task<PagedResult<StudentDto>> GetPagedAsync(int pageNumber, int pageSize = 30);
    }
}
