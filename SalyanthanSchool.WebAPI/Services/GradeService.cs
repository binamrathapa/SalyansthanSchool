using Microsoft.EntityFrameworkCore;
using SalyanthanSchool.Core.DTOs;
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

        // -----------------------------
        // GET (Paged + Filter + Search + Sort)
        // -----------------------------
        public async Task<PagedResult<GradeResponseDto>> GetAsync(
            GradeQueryParameter query)
        {
            var grades = _context.Grades.AsNoTracking();

            // -------- Search --------
            if (!string.IsNullOrWhiteSpace(query.Search))
            {
                grades = grades.Where(g =>
                    g.Name.Contains(query.Search));
            }

            // -------- Filter --------
            if (query.IsActive.HasValue)
            {
                grades = grades.Where(g =>
                    g.IsActive == query.IsActive);
            }

            // -------- Sorting --------
            grades = query.SortBy.ToLower() switch
            {
                "name" => query.SortDir == "desc"
                    ? grades.OrderByDescending(g => g.Name)
                    : grades.OrderBy(g => g.Name),

                "createdat" => query.SortDir == "desc"
                    ? grades.OrderByDescending(g => g.CreatedAt)
                    : grades.OrderBy(g => g.CreatedAt),

                _ => query.SortDir == "desc"
                    ? grades.OrderByDescending(g => g.Id)
                    : grades.OrderBy(g => g.Id)
            };

            // -------- Paging --------
            var totalCount = await grades.CountAsync();

            var items = await grades
                .Skip((query.PageNumber - 1) * query.PageSize)
                .Take(query.PageSize)
                .Select(g => new GradeResponseDto
                {
                    Id = g.Id,
                    Name = g.Name,
                    IsActive = g.IsActive,
                    CreatedAt = g.CreatedAt
                })
                .ToListAsync();

            return new PagedResult<GradeResponseDto>(
                items,
                totalCount,
                query.PageNumber,
                query.PageSize
            );
        }

        // -----------------------------
        // GET BY ID
        // -----------------------------
        public async Task<GradeResponseDto?> GetByIdAsync(int id)
        {
            var grade = await _context.Grades.FindAsync(id);
            if (grade == null) return null;

            return new GradeResponseDto
            {
                Id = grade.Id,
                Name = grade.Name,
                IsActive = grade.IsActive,
                CreatedAt = grade.CreatedAt
            };
        }

        // -----------------------------
        // CREATE
        // -----------------------------
        public async Task<GradeResponseDto> CreateAsync(GradeRequestDto dto)
        {
            var grade = new Grade
            {
                Name = dto.Name,
                IsActive = dto.IsActive
            };

            _context.Grades.Add(grade);
            await _context.SaveChangesAsync();

            return new GradeResponseDto
            {
                Id = grade.Id,
                Name = grade.Name,
                IsActive = grade.IsActive,
                CreatedAt = grade.CreatedAt
            };
        }

        // -----------------------------
        // UPDATE
        // -----------------------------
        public async Task<GradeResponseDto?> UpdateAsync(
            int id,
            GradeRequestDto dto)
        {
            var grade = await _context.Grades.FindAsync(id);
            if (grade == null) return null;

            grade.Name = dto.Name;
            grade.IsActive = dto.IsActive;
            grade.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return new GradeResponseDto
            {
                Id = grade.Id,
                Name = grade.Name,
                IsActive = grade.IsActive,
                CreatedAt = grade.CreatedAt
            };
        }

        // -----------------------------
        // DELETE
        // -----------------------------
        public async Task<bool> DeleteAsync(int id)
        {
            var grade = await _context.Grades.FindAsync(id);
            if (grade == null) return false;

            _context.Grades.Remove(grade);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
