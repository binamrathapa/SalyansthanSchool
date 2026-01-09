using Microsoft.EntityFrameworkCore;
using SalyanthanSchool.Core.DTOs.Common;
using SalyanthanSchool.Core.DTOs.Section;
using SalyanthanSchool.Core.Entities;
using SalyanthanSchool.Core.Interfaces;
using SalyanthanSchool.WebAPI.Data;

namespace SalyanthanSchool.Infrastructure.Services
{
    public class SectionService : ISectionService
    {
        private readonly SalyanthanSchoolWebAPIContext _context;

        public SectionService(SalyanthanSchoolWebAPIContext context)
        {
            _context = context;
        }

        public async Task<PagedResult<SectionResponseDto>> GetAsync(SectionQueryParameter query)
        {
            var sections = _context.Section.AsNoTracking();

            if (!string.IsNullOrWhiteSpace(query.Search))
                sections = sections.Where(s => s.SectionName.Contains(query.Search));

            if (query.IsActive.HasValue)
                sections = sections.Where(s => s.IsActive == query.IsActive);

            sections = query.SortBy.ToLower() switch
            {
                "name" => query.SortDir == "desc" ? sections.OrderByDescending(s => s.SectionName) : sections.OrderBy(s => s.SectionName),
                _ => query.SortDir == "desc" ? sections.OrderByDescending(s => s.Id) : sections.OrderBy(s => s.Id)
            };

            var totalCount = await sections.CountAsync();
            var items = await sections
                .Skip((query.PageNumber - 1) * query.PageSize)
                .Take(query.PageSize)
                .Select(s => new SectionResponseDto
                {
                    Id = s.Id,
                    SectionName = s.SectionName,
                    IsActive = s.IsActive ?? false,
                    CreatedAt = s.CreatedAt ?? DateTime.Now
                }).ToListAsync();

            return new PagedResult<SectionResponseDto>(items, totalCount, query.PageNumber, query.PageSize);
        }

        public async Task<SectionResponseDto?> GetByIdAsync(int id)
        {
            var section = await _context.Section.FindAsync(id);
            if (section == null) return null;

            return new SectionResponseDto
            {
                Id = section.Id,
                SectionName = section.SectionName,
                IsActive = section.IsActive ?? false,
                CreatedAt = section.CreatedAt ?? DateTime.Now
            };
        }

        public async Task<SectionResponseDto> CreateAsync(SectionRequestDto dto)
        {
            // Normalize input: Trim and Uppercase
            var normalizedName = dto.SectionName.Trim().ToUpper();

            var exists = await _context.Section.AnyAsync(s => s.SectionName == normalizedName);
            if (exists)
            {
                throw new InvalidOperationException($"Section '{normalizedName}' already exists.");
            }

            var section = new Section
            {
                SectionName = normalizedName,
                IsActive = dto.IsActive,
                CreatedAt = DateTime.UtcNow
            };

            _context.Section.Add(section);
            await _context.SaveChangesAsync();

            return await GetByIdAsync(section.Id);
        }

        public async Task<SectionResponseDto?> UpdateAsync(int id, SectionRequestDto dto)
        {
            var section = await _context.Section.FindAsync(id);
            if (section == null) return null;

          
            var normalizedName = dto.SectionName.Trim().ToUpper();

            // Optional: Check for duplicates (excluding current record)
            var exists = await _context.Section.AnyAsync(s => s.SectionName == normalizedName && s.Id != id);
            if (exists)
            {
                throw new InvalidOperationException($"Another section with the name '{normalizedName}' already exists.");
            }

            section.SectionName = normalizedName; // Update as Uppercase
            section.IsActive = dto.IsActive;
            section.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return await GetByIdAsync(id);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var section = await _context.Section.FindAsync(id);
            if (section == null) return false;

            _context.Section.Remove(section);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}