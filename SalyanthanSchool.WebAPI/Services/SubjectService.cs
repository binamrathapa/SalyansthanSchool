using Microsoft.EntityFrameworkCore;
using SalyanthanSchool.Core.DTOs.Common;
using SalyanthanSchool.Core.DTOs.Subject;
using SalyanthanSchool.Core.Entities;
using SalyanthanSchool.Core.Interfaces;
using SalyanthanSchool.WebAPI.Data;

namespace SalyanthanSchool.Infrastructure.Services
{
    public class SubjectService : ISubjectService
    {
        private readonly SalyanthanSchoolWebAPIContext _context;

        public SubjectService(SalyanthanSchoolWebAPIContext context)
        {
            _context = context;
        }

        // Static helper to map Entity to DTO (safe for EF Core projection)
        private static SubjectResponseDto MapToResponse(Subject subject)
        {
            return new SubjectResponseDto
            {
                Id = subject.Id,
                Name = subject.Name,
                IsActive = subject.IsActive,
                CreatedAt = subject.CreatedAt
            };
        }

        // -----------------------------
        // GET (Paged + Filter + Search + Sort)
        // -----------------------------
        public async Task<PagedResult<SubjectResponseDto>> GetAsync(
            SubjectQueryParameter query)
        {
            var subjects = _context.Subject.AsNoTracking();

            // -------- Search --------
            if (!string.IsNullOrWhiteSpace(query.Search))
            {
                subjects = subjects.Where(s =>
                    s.Name.Contains(query.Search));
            }

            // -------- Filter (IsActive) --------
            if (query.IsActive.HasValue)
            {
                subjects = subjects.Where(s =>
                    s.IsActive == query.IsActive);
            }

            // -------- Sorting --------
            subjects = query.SortBy.ToLower() switch
            {
                "name" => query.SortDir == "desc"
                    ? subjects.OrderByDescending(s => s.Name)
                    : subjects.OrderBy(s => s.Name),

                "createdat" => query.SortDir == "desc"
                    ? subjects.OrderByDescending(s => s.CreatedAt)
                    : subjects.OrderBy(s => s.CreatedAt),

                _ => query.SortDir == "desc"
                    ? subjects.OrderByDescending(s => s.Id)
                    : subjects.OrderBy(s => s.Id)
            };

            // -------- Paging --------
            var totalCount = await subjects.CountAsync();

            var items = await subjects
                .Skip((query.PageNumber - 1) * query.PageSize)
                .Take(query.PageSize)
                .Select(s => MapToResponse(s)) // Use static helper method
                .ToListAsync();

            return new PagedResult<SubjectResponseDto>(
                items,
                totalCount,
                query.PageNumber,
                query.PageSize
            );
        }

        // -----------------------------
        // GET BY ID
        // -----------------------------
        public async Task<SubjectResponseDto?> GetByIdAsync(int id)
        {
            var subject = await _context.Subject.FindAsync(id);
            return subject == null ? null : MapToResponse(subject);
        }

        // -----------------------------
        // CREATE
        // -----------------------------
        public async Task<SubjectResponseDto> CreateAsync(SubjectRequestDto dto)
        {
            // 1. Validate uniqueness
            var nameExists = await _context.Subject.AnyAsync(s => s.Name == dto.Name);

            if (nameExists)
            {
                throw new InvalidOperationException($"Subject '{dto.Name}' already exists.");
            }

            var subject = new Subject
            {
                Name = dto.Name,
                IsActive = dto.IsActive
            };

            _context.Subject.Add(subject);
            await _context.SaveChangesAsync();

            return MapToResponse(subject);
        }

        // -----------------------------
        // UPDATE
        // -----------------------------
        public async Task<SubjectResponseDto?> UpdateAsync(
            int id,
            SubjectRequestDto dto)
        {
            var subject = await _context.Subject.FindAsync(id);
            if (subject == null) return null;

            // 1. Validate uniqueness (excluding the current ID)
            var nameExists = await _context.Subject.AnyAsync(s =>
                s.Name == dto.Name && s.Id != id);

            if (nameExists)
            {
                throw new InvalidOperationException($"Subject '{dto.Name}' already exists.");
            }

            subject.Name = dto.Name;
            subject.IsActive = dto.IsActive;
            subject.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return MapToResponse(subject);
        }

        // -----------------------------
        // DELETE
        // -----------------------------
        public async Task<bool> DeleteAsync(int id)
        {
            var subject = await _context.Subject.FindAsync(id);
            if (subject == null) return false;

            _context.Subject.Remove(subject);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}