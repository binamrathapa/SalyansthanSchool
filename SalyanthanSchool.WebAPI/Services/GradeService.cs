using Microsoft.EntityFrameworkCore;
using SalyanthanSchool.Core.DTOs.Common;
using SalyanthanSchool.Core.DTOs.Grade;
using SalyanthanSchool.Core.Entities;
using SalyanthanSchool.Core.Interfaces;
using SalyanthanSchool.WebAPI.Data;

namespace SalyanthanSchool.Infrastructure.Services
{
    public class GradeService : IGradeService
    {
        private readonly SalyanthanSchoolWebAPIContext _context;

        public GradeService(SalyanthanSchoolWebAPIContext context)
        {
            _context = context;
        }

        public async Task<PagedResult<GradeResponseDto>> GetAsync(GradeQueryParameter query)
        {
            var grades = _context.Grade.Include(g => g.Section).AsNoTracking();

            if (!string.IsNullOrWhiteSpace(query.Search))
            {
                grades = grades.Where(g => g.Name.Contains(query.Search));
            }

            if (query.IsActive.HasValue)
            {
                grades = grades.Where(g => g.IsActive == query.IsActive);
            }

            // Sorting logic remains same
            grades = query.SortBy.ToLower() switch
            {
                "name" => query.SortDir == "desc" ? grades.OrderByDescending(g => g.Name) : grades.OrderBy(g => g.Name),
                "createdat" => query.SortDir == "desc" ? grades.OrderByDescending(g => g.CreatedAt) : grades.OrderBy(g => g.CreatedAt),
                _ => query.SortDir == "desc" ? grades.OrderByDescending(g => g.Id) : grades.OrderBy(g => g.Id)
            };

            var totalCount = await grades.CountAsync();

            var items = await grades
                .Skip((query.PageNumber - 1) * query.PageSize)
                .Take(query.PageSize)
                .Select(g => new GradeResponseDto
                {
                    Id = g.Id,
                    Name = g.Name,
                    IsActive = g.IsActive,
                    CreatedAt = g.CreatedAt,
                    SectionId = g.SectionId,
                    SectionName = g.Section != null ? g.Section.SectionName : "No Section"
                })
                .ToListAsync();

            return new PagedResult<GradeResponseDto>(items, totalCount, query.PageNumber, query.PageSize);
        }

        public async Task<GradeResponseDto?> GetByIdAsync(int id)
        {
            var grade = await _context.Grade.Include(g => g.Section).FirstOrDefaultAsync(x => x.Id == id);
            if (grade == null) return null;

            return new GradeResponseDto
            {
                Id = grade.Id,
                Name = grade.Name,
                IsActive = grade.IsActive,
                CreatedAt = grade.CreatedAt,
                SectionId = grade.SectionId,
                SectionName = grade.Section?.SectionName
            };
        }
        public async Task<GradeResponseDto> CreateAsync(GradeRequestDto dto)
        {
            // 1. Normalize the name to lowercase (matching your requirement)
            var normalizedName = dto.Name.Trim().ToLower();

            // 2. Check if a grade with this name already exists
            // According to your SQL script, Grade names are varchar(50)
            var exists = await _context.Grade
                .AnyAsync(g => g.Name.ToLower() == normalizedName);

            if (exists)
            {
                throw new InvalidOperationException($"A grade with the name '{dto.Name}' already exists.");
            }

            // 3. Check if the Section exists
            if (!await _context.Section.AnyAsync(s => s.Id == dto.SectionId))
                throw new InvalidOperationException("Selected section does not exist.");

            var grade = new Grade
            {
                Name = normalizedName, // Save as lowercase
                IsActive = dto.IsActive,
                SectionId = dto.SectionId,
                CreatedAt = DateTime.UtcNow
            };

            _context.Grade.Add(grade);
            await _context.SaveChangesAsync();

            return await GetByIdAsync(grade.Id);
        }

        public async Task<GradeResponseDto?> UpdateAsync(int id, GradeRequestDto dto)
        {
            var grade = await _context.Grade.FindAsync(id);
            if (grade == null) return null;

            var normalizedName = dto.Name.Trim().ToLower();

            // Check for duplicates, excluding the current record we are updating
            var exists = await _context.Grade
                .AnyAsync(g => g.Name.ToLower() == normalizedName && g.Id != id);

            if (exists)
            {
                throw new InvalidOperationException($"Another grade with the name '{dto.Name}' already exists.");
            }

            grade.Name = normalizedName;
            grade.IsActive = dto.IsActive;
            grade.SectionId = dto.SectionId;
            grade.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return await GetByIdAsync(id);
        }
        public async Task<bool> DeleteAsync(int id)
        {
            var grade = await _context.Grade.FindAsync(id);
            if (grade == null) return false;

            _context.Grade.Remove(grade);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}