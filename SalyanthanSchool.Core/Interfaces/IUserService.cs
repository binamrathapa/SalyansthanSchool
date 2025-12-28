using SalyanthanSchool.Core.DTOs.Auth;

namespace SalyanthanSchool.Core.Interfaces
{
    public interface IUserService
    {
        Task<IEnumerable<AuthResponseDto>> GetAllAsync();
        Task<AuthResponseDto?> GetByIdAsync(int id);
        Task<AuthResponseDto> CreateAsync(RegisterRequestDto dto);
        Task<AuthResponseDto?> UpdateAsync(int id, RegisterRequestDto dto);
        Task<bool> DeleteAsync(int id);
    }
}