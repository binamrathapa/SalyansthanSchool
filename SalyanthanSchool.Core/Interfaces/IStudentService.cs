using SalyanthanSchool.Core.DTOs.Student;

namespace SalyanthanSchool.Core.Interfaces
{
    public interface IStudentService
    {
        Task<IEnumerable<StudentResponseDto>> GetAllAsync(StudentQueryParameter parameters);

        Task<StudentResponseDto?> GetByIdAsync(int id);

        Task<StudentResponseDto> CreateAsync(StudentRequestDto dto);

        Task<StudentResponseDto?> UpdateAsync(int id, StudentRequestDto dto);

        Task<StudentResponseDto?> PatchAsync(int id, StudentPatchDto dto);

        Task<bool> DeleteAsync(int id);

        Task<bool> BulkDeleteAsync(List<int> ids);
    }
}