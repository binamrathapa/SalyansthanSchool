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

        // Static helper to map Entity to DTO (safe for EF Core projection)
        private static SectionResponseDto MapToResponse(Section section)
        {
            return new SectionResponseDto
            {
                Id = section.Id,
                GradeId = section.GradeId,
                // Note: GradeName must be manually handled in the query (See GetAsync)
                Name = section.Name,
                IsActive = section.IsActive,
                CreatedAt = section.CreatedAt
            };
        }

        // -----------------------------
        // GET (Paged + Filter + Search + Sort)
        // -----------------------------
        public async Task<PagedResult<SectionResponseDto>> GetAsync(
            SectionQueryParameter query)
        {
            // Include Grade for projection (to get GradeName)
            var sections = _context.Sections
                .Include(s => s.Grade)
                .AsNoTracking();

            // -------- Search --------
            if (!string.IsNullOrWhiteSpace(query.Search))
            {
                sections = sections.Where(s =>
                    s.Name.Contains(query.Search) ||
                    s.Grade.Name.Contains(query.Search));
            }

            // -------- Filter (IsActive) --------
            if (query.IsActive.HasValue)
            {
                sections = sections.Where(s =>
                    s.IsActive == query.IsActive);
            }

            // -------- Filter (GradeId) --------
            if (query.GradeId.HasValue && query.GradeId.Value > 0)
            {
                sections = sections.Where(s =>
                    s.GradeId == query.GradeId.Value);
            }

            // -------- Sorting --------
            sections = query.SortBy.ToLower() switch
            {
                "name" => query.SortDir == "desc"
                    ? sections.OrderByDescending(s => s.Name)
                    : sections.OrderBy(s => s.Name),

                "gradename" => query.SortDir == "desc"
                    ? sections.OrderByDescending(s => s.Grade.Name)
                    : sections.OrderBy(s => s.Grade.Name),

                "createdat" => query.SortDir == "desc"
                    ? sections.OrderByDescending(s => s.CreatedAt)
                    : sections.OrderBy(s => s.CreatedAt),

                _ => query.SortDir == "desc"
                    ? sections.OrderByDescending(s => s.Id)
                    : sections.OrderBy(s => s.Id)
            };

            // -------- Paging --------
            var totalCount = await sections.CountAsync();

            // Projection using inline mapping for GradeName
            var items = await sections
                .Skip((query.PageNumber - 1) * query.PageSize)
                .Take(query.PageSize)
                .Select(s => new SectionResponseDto
                {
                    Id = s.Id,
                    GradeId = s.GradeId,
                    GradeName = s.Grade.Name, // Pull Grade Name from the included navigation property
                    Name = s.Name,
                    IsActive = s.IsActive,
                    CreatedAt = s.CreatedAt
                })
                .ToListAsync();

            return new PagedResult<SectionResponseDto>(
                items,
                totalCount,
                query.PageNumber,
                query.PageSize
            );
        }

        // -----------------------------
        // GET BY ID
        // -----------------------------
        public async Task<SectionResponseDto?> GetByIdAsync(int id)
        {
            var section = await _context.Sections
                .Include(s => s.Grade) // Include Grade for the response DTO
                .AsNoTracking()
                .FirstOrDefaultAsync(s => s.Id == id);

            if (section == null) return null;

            return new SectionResponseDto
            {
                Id = section.Id,
                GradeId = section.GradeId,
                GradeName = section.Grade.Name,
                Name = section.Name,
                IsActive = section.IsActive,
                CreatedAt = section.CreatedAt
            };
        }

        // -----------------------------
        // CREATE
        // -----------------------------
        public async Task<SectionResponseDto> CreateAsync(SectionRequestDto dto)
        {
            // 1. Validate GradeId exists
            var gradeExists = await _context.Grades.AnyAsync(g => g.Id == dto.GradeId);
            if (!gradeExists)
            {
                throw new InvalidOperationException($"Grade with ID {dto.GradeId} not found.");
            }

            // 2. Validate uniqueness (Name + GradeId combo)
            var nameExists = await _context.Sections.AnyAsync(s =>
                s.Name == dto.Name && s.GradeId == dto.GradeId);

            if (nameExists)
            {
                throw new InvalidOperationException($"Section '{dto.Name}' already exists for Grade ID {dto.GradeId}.");
            }

            var section = new Section
            {
                GradeId = dto.GradeId,
                Name = dto.Name,
                IsActive = dto.IsActive
            };

            _context.Sections.Add(section);
            await _context.SaveChangesAsync();

            // To get GradeName for response, reload the entity with Grade included
            var createdSection = await GetByIdAsync(section.Id);
            return createdSection!;
        }

        // -----------------------------
        // UPDATE
        // -----------------------------
        public async Task<SectionResponseDto?> UpdateAsync(
            int id,
            SectionRequestDto dto)
        {
            var section = await _context.Sections.FindAsync(id);
            if (section == null) return null;

            // 1. Validate GradeId exists
            var gradeExists = await _context.Grades.AnyAsync(g => g.Id == dto.GradeId);
            if (!gradeExists)
            {
                throw new InvalidOperationException($"Grade with ID {dto.GradeId} not found.");
            }

            // 2. Validate uniqueness (Name + GradeId combo, excluding current ID)
            var nameExists = await _context.Sections.AnyAsync(s =>
                s.Name == dto.Name && s.GradeId == dto.GradeId && s.Id != id);

            if (nameExists)
            {
                throw new InvalidOperationException($"Section '{dto.Name}' already exists for Grade ID {dto.GradeId}.");
            }

            section.GradeId = dto.GradeId;
            section.Name = dto.Name;
            section.IsActive = dto.IsActive;
            section.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            // To get GradeName for response, reload the entity with Grade included
            var updatedSection = await GetByIdAsync(section.Id);
            return updatedSection!;
        }

        // -----------------------------
        // DELETE
        // -----------------------------
        public async Task<bool> DeleteAsync(int id)
        {
            var section = await _context.Sections.FindAsync(id);
            if (section == null) return false;

            _context.Sections.Remove(section);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}