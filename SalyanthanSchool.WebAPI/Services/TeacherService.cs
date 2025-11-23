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
    public class TeacherService : ITeacherService
    {
        private readonly SalyanthanSchoolWebAPIContext _context;

        public TeacherService(SalyanthanSchoolWebAPIContext context)
        {
            _context = context;
        }

        // Get all teachers
        public async Task<IEnumerable<TeacherDTO>> GetAllAsync()
        {
            return await _context.Teachers
                .OrderBy(t => t.Id)
                .Select(t => MapToDTO(t))
                .ToListAsync();
        }

        // Get teacher by ID
        public async Task<TeacherDTO?> GetByIdAsync(int id)
        {
            var t = await _context.Teachers.FindAsync(id);
            return t == null ? null : MapToDTO(t);
        }

        // Create teacher
        public async Task<TeacherDTO> CreateAsync(TeacherDTO dto)
        {
            var teacher = new Teacher
            {
                FirstName = dto.FirstName,
                MiddleName = dto.MiddleName,
                LastName = dto.LastName,
                Address = dto.Address,
                Email = dto.Email,
                PAN = dto.PAN,
                NID = dto.NID,
                Mobile = dto.Mobile,
                DateOfBirth = dto.DateOfBirth,
                Gender = dto.Gender,
                Citizenship = dto.Citizenship,
                Qualification = dto.Qualification,
                Photo = dto.Photo
            };

            _context.Teachers.Add(teacher);
            await _context.SaveChangesAsync();

            dto.Id = teacher.Id;
            return dto;
        }

        // Update teacher
        public async Task<TeacherDTO?> UpdateAsync(int id, TeacherDTO dto)
        {
            var teacher = await _context.Teachers.FindAsync(id);
            if (teacher == null) return null;

            teacher.FirstName = dto.FirstName;
            teacher.MiddleName = dto.MiddleName;
            teacher.LastName = dto.LastName;
            teacher.Address = dto.Address;
            teacher.Email = dto.Email;
            teacher.PAN = dto.PAN;
            teacher.NID = dto.NID;
            teacher.Mobile = dto.Mobile;
            teacher.DateOfBirth = dto.DateOfBirth;
            teacher.Gender = dto.Gender;
            teacher.Citizenship = dto.Citizenship;
            teacher.Qualification = dto.Qualification;
            teacher.Photo = dto.Photo;

            await _context.SaveChangesAsync();
            dto.Id = teacher.Id;
            return dto;
        }

        // Delete teacher
        public async Task<bool> DeleteAsync(int id)
        {
            var teacher = await _context.Teachers.FindAsync(id);
            if (teacher == null) return false;

            _context.Teachers.Remove(teacher);
            await _context.SaveChangesAsync();
            return true;
        }

        // Pagination
        public async Task<PagedResult<TeacherDTO>> GetPagedAsync(int pageNumber, int pageSize = 30)
        {
            var totalRecords = await _context.Teachers.CountAsync();
            var skip = (pageNumber - 1) * pageSize;

            var data = await _context.Teachers
                .OrderBy(t => t.Id)
                .Skip(skip)
                .Take(pageSize)
                .Select(t => MapToDTO(t))
                .ToListAsync();

            return new PagedResult<TeacherDTO>
            {
                Data = data,
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalRecords = totalRecords
            };
        }

        // Map entity to DTO
        private static TeacherDTO MapToDTO(Teacher t)
        {
            return new TeacherDTO
            {
                Id = t.Id,
                FirstName = t.FirstName,
                MiddleName = t.MiddleName,
                LastName = t.LastName,
                Address = t.Address,
                Email = t.Email,
                PAN = t.PAN,
                NID = t.NID,
                Mobile = t.Mobile,
                DateOfBirth = t.DateOfBirth,
                Gender = t.Gender,
                Citizenship = t.Citizenship,
                Qualification = t.Qualification,
                //Photo = t.Photo
            };
        }
    }
}
