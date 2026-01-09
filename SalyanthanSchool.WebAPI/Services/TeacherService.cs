using Microsoft.EntityFrameworkCore;
using SalyanthanSchool.Core.DTOs.Common;
using SalyanthanSchool.Core.DTOs.Teacher;
using SalyanthanSchool.Core.Entities;
using SalyanthanSchool.Core.Interfaces;
using SalyanthanSchool.WebAPI.Data;

namespace SalyanthanSchool.Infrastructure.Services
{
    public class TeacherService : ITeacherService
    {
        private readonly SalyanthanSchoolWebAPIContext _context;

        public TeacherService(SalyanthanSchoolWebAPIContext context)
        {
            _context = context;
        }

        // Helper to map Entity to DTO - MADE STATIC TO AVOID EF CORE PROJECTION ERROR
        private static TeacherResponseDto MapToResponse(Teacher teacher)
        {
            return new TeacherResponseDto
            {
                Id = teacher.Id,
                EmployeeCode = teacher.EmployeeCode,
                FirstName = teacher.FirstName,
                MiddleName = teacher.MiddleName,
                LastName = teacher.LastName,
                Gender = teacher.Gender,
                DateOfBirth = teacher.DateOfBirth,
                Email = teacher.Email,
                MobileNo = teacher.MobileNo,
                Address = teacher.Address,
                Qualification = teacher.Qualification,
                JoiningDate = teacher.JoiningDate,
                Photo = teacher.Photo,
                IsActive = teacher.IsActive,
                CreatedAt = teacher.CreatedAt
            };
        }

        // -----------------------------
        // GET (Paged + Filter + Search + Sort)
        // -----------------------------
        public async Task<PagedResult<TeacherResponseDto>> GetAsync(
            TeacherQueryParameter query)
        {
            var teachers = _context.Teachers.AsNoTracking();

            // -------- Search --------
            if (!string.IsNullOrWhiteSpace(query.Search))
            {
                teachers = teachers.Where(t =>
                    t.FirstName.Contains(query.Search) ||
                    t.LastName.Contains(query.Search) ||
                    t.EmployeeCode.Contains(query.Search));
            }

            // -------- Filter (IsActive) --------
            if (query.IsActive.HasValue)
            {
                teachers = teachers.Where(t =>
                    t.IsActive == query.IsActive);
            }

            // -------- Filter (Qualification) --------
            if (!string.IsNullOrWhiteSpace(query.Qualification))
            {
                teachers = teachers.Where(t =>
                    t.Qualification.Contains(query.Qualification));
            }

            // -------- Sorting --------
            teachers = query.SortBy.ToLower() switch
            {
                "employeecode" => query.SortDir == "desc"
                    ? teachers.OrderByDescending(t => t.EmployeeCode)
                    : teachers.OrderBy(t => t.EmployeeCode),

                "joiningdate" => query.SortDir == "desc"
                    ? teachers.OrderByDescending(t => t.JoiningDate)
                    : teachers.OrderBy(t => t.JoiningDate),

                "name" => query.SortDir == "desc"
                    ? teachers.OrderByDescending(t => t.LastName)
                    : teachers.OrderBy(t => t.LastName),

                "createdat" => query.SortDir == "desc"
                    ? teachers.OrderByDescending(t => t.CreatedAt)
                    : teachers.OrderBy(t => t.CreatedAt),

                _ => query.SortDir == "desc"
                    ? teachers.OrderByDescending(t => t.Id)
                    : teachers.OrderBy(t => t.Id)
            };

            // -------- Paging --------
            var totalCount = await teachers.CountAsync();

            // Projection using the static helper method
            var items = await teachers
                .Skip((query.PageNumber - 1) * query.PageSize)
                .Take(query.PageSize)
                .Select(t => MapToResponse(t))
                .ToListAsync();

            return new PagedResult<TeacherResponseDto>(
                items,
                totalCount,
                query.PageNumber,
                query.PageSize
            );
        }

        // -----------------------------
        // GET BY ID
        // -----------------------------
        public async Task<TeacherResponseDto?> GetByIdAsync(int id)
        {
            // FindAsync automatically tracks the entity
            var teacher = await _context.Teachers.FindAsync(id);
            return teacher == null ? null : MapToResponse(teacher);
        }

        // -----------------------------
        // CREATE
        // -----------------------------
        public async Task<TeacherResponseDto> CreateAsync(TeacherRequestDto dto)
        {
            // Check for unique constraints before creation
            var emailExists = await _context.Teachers.AnyAsync(t => t.Email == dto.Email);
            if (emailExists) throw new InvalidOperationException("Email already exists.");

            var codeExists = await _context.Teachers.AnyAsync(t => t.EmployeeCode == dto.EmployeeCode);
            if (codeExists) throw new InvalidOperationException("Employee Code already exists.");

            var panExists = await _context.Teachers.AnyAsync(t => t.PanNumber == dto.PanNumber);
            if (panExists) throw new InvalidOperationException("PAN Number already exists.");


            var teacher = new Teacher
            {
                EmployeeCode = dto.EmployeeCode,
                FirstName = dto.FirstName,
                MiddleName = dto.MiddleName,
                LastName = dto.LastName,
                Gender = dto.Gender,
                DateOfBirth = dto.DateOfBirth,
                Email = dto.Email,
                MobileNo = dto.MobileNo,
                Address = dto.Address,
                PanNumber = dto.PanNumber,
                Qualification = dto.Qualification,
                JoiningDate = dto.JoiningDate,
                Photo = dto.Photo,
                IsActive = dto.IsActive
                // CreatedAt is automatically set by the entity constructor
            };

            _context.Teachers.Add(teacher);
            await _context.SaveChangesAsync();

            return MapToResponse(teacher);
        }

        // -----------------------------
        // UPDATE
        // -----------------------------
        public async Task<TeacherResponseDto?> UpdateAsync(
            int id,
            TeacherRequestDto dto)
        {
            var teacher = await _context.Teachers.FindAsync(id);
            if (teacher == null) return null;

            // Check for unique constraints during update (excluding the current entity)
            var emailExists = await _context.Teachers.AnyAsync(t => t.Email == dto.Email && t.Id != id);
            if (emailExists) throw new InvalidOperationException("Email already exists.");

            var codeExists = await _context.Teachers.AnyAsync(t => t.EmployeeCode == dto.EmployeeCode && t.Id != id);
            if (codeExists) throw new InvalidOperationException("Employee Code already exists.");

            var panExists = await _context.Teachers.AnyAsync(t => t.PanNumber == dto.PanNumber && t.Id != id);
            if (panExists) throw new InvalidOperationException("PAN Number already exists.");


            // Update properties
            teacher.EmployeeCode = dto.EmployeeCode;
            teacher.FirstName = dto.FirstName;
            teacher.MiddleName = dto.MiddleName;
            teacher.LastName = dto.LastName;
            teacher.Gender = dto.Gender;
            teacher.DateOfBirth = dto.DateOfBirth;
            teacher.Email = dto.Email;
            teacher.MobileNo = dto.MobileNo;
            teacher.Address = dto.Address;
            teacher.PanNumber = dto.PanNumber;
            teacher.Qualification = dto.Qualification;
            teacher.JoiningDate = dto.JoiningDate;
            teacher.Photo = dto.Photo;
            teacher.IsActive = dto.IsActive;
            teacher.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return MapToResponse(teacher);
        }

        // -----------------------------
        // DELETE
        // -----------------------------
        public async Task<bool> DeleteAsync(int id)
        {
            var teacher = await _context.Teachers.FindAsync(id);
            if (teacher == null) return false;

            _context.Teachers.Remove(teacher);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}