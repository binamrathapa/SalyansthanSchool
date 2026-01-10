using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using SalyanthanSchool.Core.Common;
using SalyanthanSchool.Core.DTOs.Student;
using SalyanthanSchool.Core.Entities;
using SalyanthanSchool.Core.Interfaces;
using SalyanthanSchool.WebAPI.Data;

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

        /// <summary>
        /// Get all students (interface-compatible)
        /// </summary>
        public async Task<IEnumerable<StudentResponseDto>> GetAllAsync(StudentQueryParameter parameters)
        {
            var query = _context.Student.AsQueryable();

            // Filters
            if (parameters.IsActive.HasValue)
                query = query.Where(s => s.IsActive == parameters.IsActive.Value);

            if (parameters.GradeId.HasValue)
                query = query.Where(s => s.GradeId == parameters.GradeId.Value);

            //if (parameters.SectionId.HasValue)
            //    query = query.Where(s => s.SectionId == parameters.SectionId.Value);

            if (!string.IsNullOrEmpty(parameters.Gender))
                query = query.Where(s => s.Gender == parameters.Gender);

            // Search
            if (!string.IsNullOrEmpty(parameters.Search))
                query = query.Where(s =>
                    (s.FirstName != null && s.FirstName.Contains(parameters.Search)) ||
                    (s.MiddleName != null && s.MiddleName.Contains(parameters.Search)) ||
                    (s.LastName != null && s.LastName.Contains(parameters.Search)));

            // Sorting
            query = query.OrderByDynamic(parameters.SortBy, parameters.SortDir);

            // Pagination
            query = query
                .Skip((parameters.PageNumber - 1) * parameters.PageSize)
                .Take(parameters.PageSize);

            // Map to DTO
            var students = await query
                .Select(s => MapToResponse(s))
                .ToListAsync();

            return students;
        }

        public async Task<StudentResponseDto?> GetByIdAsync(int id)
        {
            var student = await _context.Student.FindAsync(id);
            return student == null ? null : MapToResponse(student);
        }

        public async Task<StudentResponseDto> CreateAsync(StudentRequestDto dto)
        {
            var photoPath = await SavePhotoAsync(dto.PhotoFile);

            var student = new Student
            {
                FirstName = dto.FirstName,
                MiddleName = dto.MiddleName,
                LastName = dto.LastName,
                Gender = dto.Gender,
                BloodGroup = dto.BloodGroup,
                DateOfBirth = dto.DateOfBirth?.ToDateTime(TimeOnly.MinValue),
                AdmissionDate = dto.AdmissionDate.ToDateTime(TimeOnly.MinValue),
                Address = dto.Address,
                GuardianName = dto.GuardianName,
                GuardianContact = dto.GuardianContact,
                GradeId = dto.GradeId,
                //SectionId = dto.SectionId,
                Photo = photoPath,
                IsActive = dto.IsActive,
                CreatedAt = DateTime.UtcNow
            };

            _context.Student.Add(student);
            await _context.SaveChangesAsync();

            return MapToResponse(student);
        }

        public async Task<StudentResponseDto?> UpdateAsync(int id, StudentRequestDto dto)
        {
            var student = await _context.Student.FindAsync(id);
            if (student == null) return null;

            student.FirstName = dto.FirstName;
            student.MiddleName = dto.MiddleName;
            student.LastName = dto.LastName;
            student.Gender = dto.Gender;
            student.BloodGroup = dto.BloodGroup;
            student.DateOfBirth = dto.DateOfBirth?.ToDateTime(TimeOnly.MinValue);
            student.AdmissionDate = dto.AdmissionDate.ToDateTime(TimeOnly.MinValue);
            student.Address = dto.Address;
            student.GuardianName = dto.GuardianName;
            student.GuardianContact = dto.GuardianContact;
            student.GradeId = dto.GradeId;
            //student.SectionId = dto.SectionId;
            student.IsActive = dto.IsActive;

            if (dto.PhotoFile != null)
            {
                var newPhoto = await SavePhotoAsync(dto.PhotoFile);
                if (!string.IsNullOrEmpty(student.Photo))
                {
                    var oldPath = Path.Combine(_env.WebRootPath, student.Photo.TrimStart('/'));
                    if (File.Exists(oldPath)) File.Delete(oldPath);
                }
                student.Photo = newPhoto;
            }

            student.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return MapToResponse(student);
        }

        public async Task<StudentResponseDto?> PatchAsync(int id, StudentPatchDto dto)
        {
            var student = await _context.Student.FindAsync(id);
            if (student == null) return null;

            if (dto.FirstName != null) student.FirstName = dto.FirstName;
            if (dto.MiddleName != null) student.MiddleName = dto.MiddleName;
            if (dto.LastName != null) student.LastName = dto.LastName;
            if (dto.Gender != null) student.Gender = dto.Gender;
            if (dto.BloodGroup != null) student.BloodGroup = dto.BloodGroup;
            if (dto.DateOfBirth.HasValue)
                student.DateOfBirth = dto.DateOfBirth.Value.ToDateTime(TimeOnly.MinValue);
            if (dto.Address != null) student.Address = dto.Address;
            if (dto.GuardianName != null) student.GuardianName = dto.GuardianName;
            if (dto.GuardianContact != null) student.GuardianContact = dto.GuardianContact;
            if (dto.GradeId.HasValue) student.GradeId = dto.GradeId.Value;
            //if (dto.SectionId.HasValue) student.SectionId = dto.SectionId.Value;
            if (dto.IsActive.HasValue) student.IsActive = dto.IsActive.Value;

            if (dto.PhotoFile != null)
            {
                var newPhoto = await SavePhotoAsync(dto.PhotoFile);
                if (!string.IsNullOrEmpty(student.Photo))
                {
                    var oldPath = Path.Combine(_env.WebRootPath, student.Photo.TrimStart('/'));
                    if (File.Exists(oldPath)) File.Delete(oldPath);
                }
                student.Photo = newPhoto;
            }

            student.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return MapToResponse(student);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var student = await _context.Student.FindAsync(id);
            if (student == null) return false;

            if (!string.IsNullOrEmpty(student.Photo))
            {
                var path = Path.Combine(_env.WebRootPath, student.Photo.TrimStart('/'));
                if (File.Exists(path)) File.Delete(path);
            }

            _context.Student.Remove(student);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> BulkDeleteAsync(List<int> ids)
        {
            var students = await _context.Student.Where(s => ids.Contains(s.Id)).ToListAsync();
            if (!students.Any()) return false;

            foreach (var s in students)
            {
                if (!string.IsNullOrEmpty(s.Photo))
                {
                    var path = Path.Combine(_env.WebRootPath, s.Photo.TrimStart('/'));
                    if (File.Exists(path)) File.Delete(path);
                }
            }

            _context.Student.RemoveRange(students);
            await _context.SaveChangesAsync();
            return true;
        }

        private async Task<string?> SavePhotoAsync(IFormFile? file)
        {
            if (file == null || file.Length == 0) return null;

            var uploadsFolder = Path.Combine(_env.WebRootPath, "uploads", "students");
            Directory.CreateDirectory(uploadsFolder);

            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
            var filePath = Path.Combine(uploadsFolder, fileName);

            using var stream = new FileStream(filePath, FileMode.Create);
            await file.CopyToAsync(stream);

            return $"/uploads/students/{fileName}";
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
            GradeId = s.GradeId,
            //SectionId = s.SectionId,
            Photo = s.Photo,
            IsActive = s.IsActive,
            CreatedAt = s.CreatedAt ?? DateTime.UtcNow
        };
    }
}
