using Microsoft.EntityFrameworkCore;
using SalyanthanSchool.Core.DTOs.Auth;
using SalyanthanSchool.Core.Entities;
using SalyanthanSchool.Core.Interfaces;
using SalyanthanSchool.WebAPI.Data;

namespace SalyanthanSchool.WebAPI.Services
{
    public class UserService : IUserService
    {
        private readonly SalyanthanSchoolWebAPIContext _context;

        public UserService(SalyanthanSchoolWebAPIContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<AuthResponseDto>> GetAllAsync()
        {
            var users = await _context.SystemUser.ToListAsync();
            return users.Select(u => MapToResponse(u));
        }

        public async Task<AuthResponseDto?> GetByIdAsync(int id)
        {
            var user = await _context.SystemUser.FindAsync(id);
            return user == null ? null : MapToResponse(user);
        }

        public async Task<AuthResponseDto> CreateAsync(RegisterRequestDto dto)
        {
            var user = new SystemUser
            {
                Username = dto.Username,
                // Encrypt password before saving
                Password = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = dto.Role,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                Status = true
            };

            _context.SystemUser.Add(user);
            await _context.SaveChangesAsync();
            return MapToResponse(user);
        }

        public async Task<AuthResponseDto?> UpdateAsync(int id, RegisterRequestDto dto)
        {
            var user = await _context.SystemUser.FindAsync(id);
            if (user == null) return null;

            user.FirstName = dto.FirstName;
            user.LastName = dto.LastName;
            user.Email = dto.Email;
            user.Role = dto.Role;

            // Only update password if a new one is provided
            if (!string.IsNullOrWhiteSpace(dto.Password))
                user.Password = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            await _context.SaveChangesAsync();
            return MapToResponse(user);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var user = await _context.SystemUser.FindAsync(id);
            if (user == null) return false;

            _context.SystemUser.Remove(user);
            await _context.SaveChangesAsync();
            return true;
        }

        // Helper to convert Entity to Response DTO
        private static AuthResponseDto MapToResponse(SystemUser u) => new AuthResponseDto
        {
            IsSuccess = true,
            Username = u.Username,
            Role = u.Role,
            Message = "User data retrieved"
        };
    }
}