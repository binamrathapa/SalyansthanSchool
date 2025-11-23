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
    public class GradeService : IGradeService
    {
        private readonly SalyanthanSchoolWebAPIContext _context;

        public GradeService(SalyanthanSchoolWebAPIContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<GradeDto>> GetAllAsync()
        {
            return await _context.Grades
                .OrderBy(g => g.Id)
                .Select(g => MapToDTO(g))
                .ToListAsync();
        }

        public async Task<GradeDto?> GetByIdAsync(int id)
        {
            var g = await _context.Grades.FindAsync(id);
            return g == null ? null : MapToDTO(g);
        }

        public async Task<GradeDto> CreateAsync(GradeDto dto)
        {
            var entity = new Grade
            {
                Name = dto.Name
            };

            _context.Grades.Add(entity);
            await _context.SaveChangesAsync();

            dto.Id = entity.Id;
            return dto;
        }

        public async Task<GradeDto?> UpdateAsync(int id, GradeDto dto)
        {
            var entity = await _context.Grades.FindAsync(id);
            if (entity == null) return null;

            entity.Name = dto.Name;
            await _context.SaveChangesAsync();

            dto.Id = entity.Id;
            return dto;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var entity = await _context.Grades.FindAsync(id);
            if (entity == null) return false;

            _context.Grades.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<PagedResult<GradeDto>> GetPagedAsync(int pageNumber, int pageSize = 30)
        {
            if (pageNumber < 1) pageNumber = 1;

            var total = await _context.Grades.CountAsync();
            var skip = (pageNumber - 1) * pageSize;

            var data = await _context.Grades
                .OrderBy(g => g.Id)
                .Skip(skip)
                .Take(pageSize)
                .Select(g => MapToDTO(g))
                .ToListAsync();

            return new PagedResult<GradeDto>
            {
                Data = data,
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalRecords = total
            };
        }

        private static GradeDto MapToDTO(Grade g)
        {
            return new GradeDto
            {
                Id = g.Id,
                Name = g.Name
            };
        }
    }
}
