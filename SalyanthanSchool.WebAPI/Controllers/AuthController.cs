using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SalyanthanSchool.Core.DTOs.Auth;
using SalyanthanSchool.Core.DTOs.Common;
using SalyanthanSchool.Core.Interfaces;
using System.Security.Claims;

[AllowAnonymous]
[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequestDto dto)
    {
        var result = await _authService.LoginAsync(dto);
        if (!result.IsSuccess)
        {
            return Unauthorized(ApiResponse<AuthResponseDto>.Fail(result.Message));
        }
        return Ok(ApiResponse<AuthResponseDto>.Ok(result, "Login successful"));
    }

    [Authorize]
    [HttpPost("change-password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequestDto dto)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userIdClaim == null) return Unauthorized();

        var userId = int.Parse(userIdClaim);
        var result = await _authService.ChangePasswordAsync(userId, dto);

        if (!result.IsSuccess)
        {
            return BadRequest(ApiResponse<AuthResponseDto>.Fail(result.Message));
        }

        return Ok(ApiResponse<AuthResponseDto>.Ok(result, result.Message));
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequestDto dto)
    {
        var result = await _authService.RegisterAsync(dto);
        if (!result.IsSuccess)
        {
            return BadRequest(ApiResponse<AuthResponseDto>.Fail(result.Message));
        }
        return Ok(ApiResponse<AuthResponseDto>.Ok(result, "Registeration successful"));
    }

    [Authorize]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        var result = await _authService.LogoutAsync();
        return Ok(ApiResponse<AuthResponseDto>.Ok(result, "Logout successful"));
    }
}
