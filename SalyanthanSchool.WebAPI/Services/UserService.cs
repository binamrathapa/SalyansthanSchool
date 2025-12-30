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

        public async Task<IEnumerable<UserListDto>> GetAllAsync()
        {
            return await _context.SystemUser
                .Select(u => new UserListDto
                {
                    Id = u.Id,
                    Username = u.Username,
                    Role = u.Role,
                    FirstName = u.FirstName,
                    LastName = u.LastName,
                    Email = u.Email
                })
                .ToListAsync();
        }

        public async Task<UserListDto?> GetByIdAsync(int id)
        {
            return await _context.SystemUser
                .Where(u => u.Id == id)
                .Select(u => new UserListDto
                {
                    Id = u.Id,
                    Username = u.Username,
                    Role = u.Role,
                    FirstName = u.FirstName,
                    LastName = u.LastName,
                    Email = u.Email
                })
                .FirstOrDefaultAsync();
        }

        public async Task<UserListDto> CreateAsync(RegisterRequestDto dto)
        {
            var user = new SystemUser
            {
                Username = dto.Username,
                Password = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = dto.Role,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                Status = true
            };

            _context.SystemUser.Add(user);
            await _context.SaveChangesAsync();

            return new UserListDto
            {
                Id = user.Id,
                Username = user.Username,
                Role = user.Role,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email
            };
        }

        public async Task<bool> UpdateAsync(int id, UpdateUserDto dto)
        {
            var user = await _context.SystemUser.FindAsync(id);
            if (user == null) return false;

            if (!string.IsNullOrWhiteSpace(dto.Username)) user.Username = dto.Username;
            if (!string.IsNullOrWhiteSpace(dto.FirstName)) user.FirstName = dto.FirstName;
            if (!string.IsNullOrWhiteSpace(dto.LastName)) user.LastName = dto.LastName;
            if (!string.IsNullOrWhiteSpace(dto.Email)) user.Email = dto.Email;
            if (!string.IsNullOrWhiteSpace(dto.Role)) user.Role = dto.Role;

            if (!string.IsNullOrWhiteSpace(dto.Password))
                user.Password = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var user = await _context.SystemUser.FindAsync(id);
            if (user == null) return false;

            _context.SystemUser.Remove(user);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
