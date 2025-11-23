using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SalyanthanSchool.Core.DTOs;
using SalyanthanSchool.Core.Entities;
using SalyanthanSchool.Core.Interfaces;
using SalyanthanSchool.WebAPI.Data;

namespace SalyanthanSchool.Core.Services
{
    public class StudentService : IStudentService
    {
        private readonly SalyanthanSchoolWebAPIContext _context;

        public StudentService(SalyanthanSchoolWebAPIContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<StudentDto>> GetAllAsync()
        {
            return await _context.Students
                .OrderBy(s => s.Id)
                .Select(s => MapToDTO(s))
                .ToListAsync();
        }

        public async Task<StudentDto?> GetByIdAsync(int id)
        {
            var s = await _context.Students.FindAsync(id);
            return s == null ? null : MapToDTO(s);
        }

        public async Task<StudentDto> CreateAsync(StudentDto dto)
        {
            var entity = new Student
            {
                FirstName = dto.FirstName,
                MiddleName = dto.MiddleName,
                LastName = dto.LastName,
                ParentName = dto.ParentName,
                GuardianName = dto.GuardianName,
                Mobile = dto.Mobile,
                Address = dto.Address,
                DateOfBirth = dto.DateOfBirth,
                AdmissionDate = dto.AdmissionDate,
                BloodGroup = dto.BloodGroup,
                Gender = dto.Gender,
                Photo = dto.Photo
                // If you add GradeId in entity, set it here
            };

            _context.Students.Add(entity);
            await _context.SaveChangesAsync();

            dto.Id = entity.Id;
            return dto;
        }

        public async Task<StudentDto?> UpdateAsync(int id, StudentDto dto)
        {
            var entity = await _context.Students.FindAsync(id);
            if (entity == null) return null;

            entity.FirstName = dto.FirstName;
            entity.MiddleName = dto.MiddleName;
            entity.LastName = dto.LastName;
            entity.ParentName = dto.ParentName;
            entity.GuardianName = dto.GuardianName;
            entity.Mobile = dto.Mobile;
            entity.Address = dto.Address;
            entity.DateOfBirth = dto.DateOfBirth;
            entity.AdmissionDate = dto.AdmissionDate;
            entity.BloodGroup = dto.BloodGroup;
            entity.Gender = dto.Gender;
            entity.Photo = dto.Photo;
            // update GradeId if you add it

            await _context.SaveChangesAsync();

            dto.Id = entity.Id;
            return dto;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var entity = await _context.Students.FindAsync(id);
            if (entity == null) return false;

            _context.Students.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<PagedResult<StudentDto>> GetPagedAsync(int pageNumber, int pageSize = 30)
        {
            if (pageNumber < 1) pageNumber = 1;

            var total = await _context.Students.CountAsync();
            var skip = (pageNumber - 1) * pageSize;

            var data = await _context.Students
                .OrderBy(s => s.Id)
                .Skip(skip)
                .Take(pageSize)
                .Select(s => MapToDTO(s))
                .ToListAsync();

            return new PagedResult<StudentDto>
            {
                Data = data,
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalRecords = total
            };
        }

        private static StudentDto MapToDTO(Student s)
        {
            return new StudentDto
            {
                Id = s.Id,
                FirstName = s.FirstName,
                MiddleName = s.MiddleName,
                LastName = s.LastName,
                ParentName = s.ParentName,
                GuardianName = s.GuardianName,
                Mobile = s.Mobile,
                Address = s.Address,
                DateOfBirth = s.DateOfBirth,
                AdmissionDate = s.AdmissionDate,
                BloodGroup = s.BloodGroup,
                Gender = s.Gender,
                Photo = s.Photo
                // GradeId mapping if you add it
            };
        }
    }
}
