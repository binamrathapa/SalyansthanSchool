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
            var gradesQuery = _context.Grade.Include(g => g.Section).AsNoTracking();

            // --- Filtering ---
            if (!string.IsNullOrWhiteSpace(query.Search))
                gradesQuery = gradesQuery.Where(g => g.Name.Contains(query.Search));

            if (query.IsActive.HasValue)
                gradesQuery = gradesQuery.Where(g => g.IsActive == query.IsActive);

            // Get data from DB
            var rawList = await gradesQuery.ToListAsync();

            // --- Grouping Logic to create the nested structure ---
            var groupedItems = rawList
                .GroupBy(g => g.Name.ToLower())
                .Select(group => new GradeResponseDto
                {
                    Id = group.First().Id, // Use the first ID found for this grade name
                    Name = group.First().Name,
                    IsActive = group.First().IsActive,
                    CreatedAt = group.First().CreatedAt,
                    Sections = group
                        .Where(x => x.Section != null)
                        .Select(s => new SectionSummaryDto
                        {
                            Id = s.SectionId ?? 0,
                            Name = s.Section?.SectionName ?? "N/A"
                        }).ToList()
                });

            // --- Sorting ---
            groupedItems = query.SortBy.ToLower() switch
            {
                "name" => query.SortDir == "desc" ? groupedItems.OrderByDescending(g => g.Name) : groupedItems.OrderBy(g => g.Name),
                _ => query.SortDir == "desc" ? groupedItems.OrderByDescending(g => g.Id) : groupedItems.OrderBy(g => g.Id)
            };

            var totalCount = groupedItems.Count();

            var items = groupedItems
                .Skip((query.PageNumber - 1) * query.PageSize)
                .Take(query.PageSize)
                .ToList();

            return new PagedResult<GradeResponseDto>(items, totalCount, query.PageNumber, query.PageSize);
        }

        public async Task<GradeResponseDto?> GetByIdAsync(int id)
        {
            // First find the grade to get its name
            var grade = await _context.Grade.Include(g => g.Section).FirstOrDefaultAsync(x => x.Id == id);
            if (grade == null) return null;

            // Find all entries with the same name to gather all sections
            var allSectionsForThisGrade = await _context.Grade
                .Include(g => g.Section)
                .Where(g => g.Name.ToLower() == grade.Name.ToLower())
                .ToListAsync();

            return new GradeResponseDto
            {
                Id = grade.Id,
                Name = grade.Name,
                IsActive = grade.IsActive,
                CreatedAt = grade.CreatedAt,
                Sections = allSectionsForThisGrade
                    .Where(x => x.Section != null)
                    .Select(s => new SectionSummaryDto
                    {
                        Id = s.SectionId ?? 0,
                        Name = s.Section?.SectionName ?? "N/A"
                    }).ToList()
            };
        }

        public async Task<GradeResponseDto> CreateAsync(GradeRequestDto dto)
        {
            var normalizedName = dto.Name.Trim().ToLower();

            // Check if this specific Grade-Section combination already exists
            var exists = await _context.Grade
                .AnyAsync(g => g.Name.ToLower() == normalizedName && g.SectionId == dto.SectionId);

            if (exists)
                throw new InvalidOperationException($"Grade '{dto.Name}' with this section already exists.");

            var grade = new Grade
            {
                Name = dto.Name.Trim(),
                IsActive = dto.IsActive,
                SectionId = dto.SectionId,
                CreatedAt = DateTime.UtcNow
            };

            _context.Grade.Add(grade);
            await _context.SaveChangesAsync();

            return (await GetByIdAsync(grade.Id))!;
        }

        public async Task<GradeResponseDto?> UpdateAsync(int id, GradeRequestDto dto)
        {
            var grade = await _context.Grade.FindAsync(id);
            if (grade == null) return null;

            grade.Name = dto.Name.Trim();
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