using SalyanthanSchool.Core.DTOs.Auth;

namespace SalyanthanSchool.Core.Interfaces
{
    public interface IUserService
    {
        Task<IEnumerable<UserListDto>> GetAllAsync();
        Task<UserListDto?> GetByIdAsync(int id);
        Task<UserListDto> CreateAsync(RegisterRequestDto dto);
        Task<bool> UpdateAsync(int id, UpdateUserDto dto);
        Task<bool> DeleteAsync(int id);
    }
}
