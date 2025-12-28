using SalyanthanSchool.Core.DTOs.Auth;

namespace SalyanthanSchool.Core.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponseDto> LoginAsync(LoginRequestDto dto);
        Task<AuthResponseDto> RegisterAsync(RegisterRequestDto dto);
        Task<AuthResponseDto> LogoutAsync();
    }
}
