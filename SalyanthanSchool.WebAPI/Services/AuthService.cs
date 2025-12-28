using Microsoft.EntityFrameworkCore;
using SalyanthanSchool.Core.DTOs.Auth;
using SalyanthanSchool.Core.Entities;
using SalyanthanSchool.Core.Interfaces;
using SalyanthanSchool.WebAPI.Data;
using SalyanthanSchool.WebAPI.Utils;

namespace SalyanthanSchool.WebAPI.Services
{
    public class AuthService : IAuthService
    {
        private readonly SalyanthanSchoolWebAPIContext _context;
        private readonly IConfiguration _config;

        public AuthService(SalyanthanSchoolWebAPIContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        public async Task<AuthResponseDto> RegisterAsync(RegisterRequestDto dto)
        {
            var exists = await _context.SystemUser
                .AnyAsync(x => x.Username == dto.Username);

            if (exists)
                return new AuthResponseDto
                {
                    IsSuccess = false,
                    Message = "Username already exists"
                };

            var user = new SystemUser
            {
                Username = dto.Username,
                Password = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = dto.Role ?? "User",
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                Status = true
            };

            _context.SystemUser.Add(user);
            await _context.SaveChangesAsync();

            var token = JwtHelper.GenerateToken(user, _config);

            return new AuthResponseDto
            {
                IsSuccess = true,
                Username = user.Username,
                Role = user.Role,
                Token = token,
                Message = "Registration successful"
            };
        }

        public async Task<AuthResponseDto> LoginAsync(LoginRequestDto dto)
        {
            var user = await _context.SystemUser
                .FirstOrDefaultAsync(x => x.Username == dto.Username && x.Status);

            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.Password))
                return new AuthResponseDto
                {
                    IsSuccess = false,
                    Message = "Invalid username or password"
                };

            var token = JwtHelper.GenerateToken(user, _config);

            return new AuthResponseDto
            {
                IsSuccess = true,
                Username = user.Username,
                Role = user.Role,
                Token = token,
                Message = "Login successful"
            };
        }

        public async Task<AuthResponseDto> LogoutAsync()
        {
            return await Task.FromResult(new AuthResponseDto
            {
                IsSuccess = true,
                Message = "Logged out successfully. Please delete the token from client storage."
            });
        }
    }
}
