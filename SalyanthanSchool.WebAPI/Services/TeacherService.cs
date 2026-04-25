using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using SalyanthanSchool.Core.DTOs.Common;
using SalyanthanSchool.Core.DTOs.Teacher;
using SalyanthanSchool.Core.Entities;
using SalyanthanSchool.Core.Interfaces;
using SalyanthanSchool.WebAPI.Data;
using System.IO;

namespace SalyanthanSchool.Infrastructure.Services
{
    public class TeacherService : ITeacherService
    {
        private readonly SalyanthanSchoolWebAPIContext _context;
        private readonly IWebHostEnvironment _env;

        public TeacherService(SalyanthanSchoolWebAPIContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
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
                PanNumber = teacher.PanNumber,
                NidNumber = teacher.NidNumber,
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

            var panExists = await _context.Teachers.AnyAsync(t => t.PanNumber == dto.PanNumber);
            if (panExists) throw new InvalidOperationException("PAN Number already exists.");

            if (!string.IsNullOrEmpty(dto.NidNumber))
            {
                var nidExists = await _context.Teachers.AnyAsync(t => t.NidNumber == dto.NidNumber);
                if (nidExists) throw new InvalidOperationException("NID Number already exists.");
            }

            var photoPath = await SavePhotoAsync(dto.Photo);

            var teacher = new Teacher
            {
                FirstName = dto.FirstName,
                MiddleName = dto.MiddleName,
                LastName = dto.LastName,
                Gender = dto.Gender,
                DateOfBirth = dto.DateOfBirth,
                Email = dto.Email,
                MobileNo = dto.MobileNo,
                Address = dto.Address,
                PanNumber = dto.PanNumber,
                NidNumber = dto.NidNumber,
                Qualification = dto.Qualification,
                JoiningDate = dto.JoiningDate,
                Photo = photoPath,
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

            var panExists = await _context.Teachers.AnyAsync(t => t.PanNumber == dto.PanNumber && t.Id != id);
            if (panExists) throw new InvalidOperationException("PAN Number already exists.");

            if (!string.IsNullOrEmpty(dto.NidNumber))
            {
                var nidExists = await _context.Teachers.AnyAsync(t => t.NidNumber == dto.NidNumber && t.Id != id);
                if (nidExists) throw new InvalidOperationException("NID Number already exists.");
            }


            // Update properties
            teacher.FirstName = dto.FirstName;
            teacher.MiddleName = dto.MiddleName;
            teacher.LastName = dto.LastName;
            teacher.Gender = dto.Gender;
            teacher.DateOfBirth = dto.DateOfBirth;
            teacher.Email = dto.Email;
            teacher.MobileNo = dto.MobileNo;
            teacher.Address = dto.Address;
            teacher.PanNumber = dto.PanNumber;
            teacher.NidNumber = dto.NidNumber;
            teacher.Qualification = dto.Qualification;
            teacher.JoiningDate = dto.JoiningDate;
            teacher.IsActive = dto.IsActive;
            teacher.UpdatedAt = DateTime.UtcNow;

            if (dto.Photo != null)
            {
                DeleteExistingPhoto(teacher.Photo);
                teacher.Photo = await SavePhotoAsync(dto.Photo);
            }

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

            DeleteExistingPhoto(teacher.Photo);

            _context.Teachers.Remove(teacher);
            await _context.SaveChangesAsync();
            return true;
        }

        // --- Helper Methods ---

        private async Task<string?> SavePhotoAsync(IFormFile? file)
        {
            if (file == null || file.Length == 0) return null;

            var uploadsFolder = Path.Combine(_env.WebRootPath, "uploads", "teachers");
            if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);

            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
            var filePath = Path.Combine(uploadsFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return $"/uploads/teachers/{fileName}";
        }

        private void DeleteExistingPhoto(string? photoPath)
        {
            if (string.IsNullOrEmpty(photoPath)) return;
            var fullPath = Path.Combine(_env.WebRootPath, photoPath.TrimStart('/'));
            if (File.Exists(fullPath)) File.Delete(fullPath);
        }
    }
}