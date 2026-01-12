using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using SalyanthanSchool.Core.Common;
using SalyanthanSchool.Core.DTOs.Student;
using SalyanthanSchool.Core.Entities;
using SalyanthanSchool.Core.Interfaces;
using SalyanthanSchool.WebAPI.Data;
using System.Linq.Dynamic.Core;

namespace SalyanthanSchool.WebAPI.Services
{
    public class StudentService : IStudentService
    {
        private readonly SalyanthanSchoolWebAPIContext _context;
        private readonly IWebHostEnvironment _env;

        public StudentService(SalyanthanSchoolWebAPIContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        public async Task<IEnumerable<StudentResponseDto>> GetAllAsync(StudentQueryParameter parameters)
        {
            // Use .Include(s => s.Grade) to perform a SQL JOIN and get Grade data
            var query = _context.Student
                .Include(s => s.Grade)
                .AsQueryable();

            // --- Filtering ---
            if (parameters.IsActive.HasValue)
                query = query.Where(s => s.IsActive == parameters.IsActive.Value);

            if (!string.IsNullOrWhiteSpace(parameters.GradeName))
            {
                var gradeSearch = parameters.GradeName.Trim().ToLower();
                query = query.Where(s => s.Grade.Name.ToLower() == gradeSearch);

            }
            if (!string.IsNullOrEmpty(parameters.Gender))
                query = query.Where(s => s.Gender == parameters.Gender);

            // --- Search (Full Name) ---
            if (!string.IsNullOrEmpty(parameters.Search))
            {
                var search = parameters.Search.Trim().ToLower();
                query = query.Where(s =>
                    s.FirstName.ToLower().Contains(search) ||
                    (s.MiddleName != null && s.MiddleName.ToLower().Contains(search)) ||
                    s.LastName.ToLower().Contains(search));
            }

            // --- Sorting & Pagination ---
            // Note: OrderByDynamic is a custom extension method assumed to be in your Core.Common
            query = query.OrderByDynamic(parameters.SortBy ?? "Id", parameters.SortDir ?? "asc");

            var totalItems = await query.CountAsync();

            var students = await query
                .Skip((parameters.PageNumber - 1) * parameters.PageSize)
                .Take(parameters.PageSize)
                .ToListAsync();

            return students.Select(MapToResponse);
        }

        public async Task<StudentResponseDto?> GetByIdAsync(int id)
        {
            // FindAsync does not support Include, so we use FirstOrDefaultAsync
            var student = await _context.Student
                .Include(s => s.Grade)
                .FirstOrDefaultAsync(s => s.Id == id);

            return student == null ? null : MapToResponse(student);
        }

        public async Task<StudentResponseDto> CreateAsync(StudentRequestDto dto)
        {
            var photoPath = await SavePhotoAsync(dto.PhotoFile);

            var student = new Student
            {
                // AdmissionNo is handled automatically by the Database Sequence/Default
                FirstName = dto.FirstName.Trim(),
                MiddleName = dto.MiddleName?.Trim(),
                LastName = dto.LastName.Trim(),
                Gender = dto.Gender,
                BloodGroup = dto.BloodGroup,
                DateOfBirth = dto.DateOfBirth?.ToDateTime(TimeOnly.MinValue),
                AdmissionDate = dto.AdmissionDate.ToDateTime(TimeOnly.MinValue),
                Address = dto.Address,
                GuardianName = dto.GuardianName,
                GuardianContact = dto.GuardianContact,
                GradeId = dto.GradeId,
                Photo = photoPath,
                IsActive = dto.IsActive,
                CreatedAt = DateTime.UtcNow
            };

            _context.Student.Add(student);
            await _context.SaveChangesAsync();

            // Refresh from DB to get the Grade Name and the DB-generated AdmissionNo
            return (await GetByIdAsync(student.Id))!;
        }

        public async Task<StudentResponseDto?> UpdateAsync(int id, StudentRequestDto dto)
        {
            var student = await _context.Student.FindAsync(id);
            if (student == null) return null;

            student.FirstName = dto.FirstName.Trim();
            student.MiddleName = dto.MiddleName?.Trim();
            student.LastName = dto.LastName.Trim();
            student.Gender = dto.Gender;
            student.BloodGroup = dto.BloodGroup;
            student.DateOfBirth = dto.DateOfBirth?.ToDateTime(TimeOnly.MinValue);
            student.AdmissionDate = dto.AdmissionDate.ToDateTime(TimeOnly.MinValue);
            student.Address = dto.Address;
            student.GuardianName = dto.GuardianName;
            student.GuardianContact = dto.GuardianContact;
            //student.GradeId = dto.GradeId;
            student.IsActive = dto.IsActive;
            student.UpdatedAt = DateTime.UtcNow;

            if (dto.PhotoFile != null)
            {
                // Delete old photo
                DeleteExistingPhoto(student.Photo);
                student.Photo = await SavePhotoAsync(dto.PhotoFile);
            }

            await _context.SaveChangesAsync();
            return await GetByIdAsync(id);
        }

        public async Task<StudentResponseDto?> PatchAsync(int id, StudentPatchDto dto)
        {
            var student = await _context.Student.FindAsync(id);
            if (student == null) return null;

            if (dto.FirstName != null) student.FirstName = dto.FirstName.Trim();
            if (dto.LastName != null) student.LastName = dto.LastName.Trim();
            if (dto.MiddleName != null) student.MiddleName = dto.MiddleName.Trim();
            if (dto.Gender != null) student.Gender = dto.Gender;
            if (dto.GradeId.HasValue) student.GradeId = dto.GradeId.Value;
            if (dto.IsActive.HasValue) student.IsActive = dto.IsActive.Value;
            if (dto.Address != null) student.Address = dto.Address;

            if (dto.PhotoFile != null)
            {
                DeleteExistingPhoto(student.Photo);
                student.Photo = await SavePhotoAsync(dto.PhotoFile);
            }

            student.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return await GetByIdAsync(id);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var student = await _context.Student.FindAsync(id);
            if (student == null) return false;

            DeleteExistingPhoto(student.Photo);

            _context.Student.Remove(student);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> BulkDeleteAsync(List<int> ids)
        {
            var students = await _context.Student.Where(s => ids.Contains(s.Id)).ToListAsync();
            if (!students.Any()) return false;

            foreach (var student in students)
            {
                DeleteExistingPhoto(student.Photo);
            }

            _context.Student.RemoveRange(students);
            await _context.SaveChangesAsync();
            return true;
        }

        // --- Helper Methods ---

        private async Task<string?> SavePhotoAsync(IFormFile? file)
        {
            if (file == null || file.Length == 0) return null;

            var uploadsFolder = Path.Combine(_env.WebRootPath, "uploads", "students");
            if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);

            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
            var filePath = Path.Combine(uploadsFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return $"/uploads/students/{fileName}";
        }

        private void DeleteExistingPhoto(string? photoPath)
        {
            if (string.IsNullOrEmpty(photoPath)) return;
            var fullPath = Path.Combine(_env.WebRootPath, photoPath.TrimStart('/'));
            if (File.Exists(fullPath)) File.Delete(fullPath);
        }

        private static StudentResponseDto MapToResponse(Student s) => new StudentResponseDto
        {
            Id = s.Id,
            FirstName = s.FirstName,
            MiddleName = s.MiddleName,
            LastName = s.LastName,
            Gender = s.Gender,
            BloodGroup = s.BloodGroup,
            DateOfBirth = s.DateOfBirth.HasValue ? DateOnly.FromDateTime(s.DateOfBirth.Value) : null,
            AdmissionDate = DateOnly.FromDateTime(s.AdmissionDate),
            Address = s.Address,
            GuardianName = s.GuardianName,
            GuardianContact = s.GuardianContact,
            //GradeId = s.GradeId,
            GradeName = s.Grade?.Name, 
            Photo = s.Photo,
            IsActive = s.IsActive,
            CreatedAt = s.CreatedAt ?? DateTime.UtcNow
        };
    }
}