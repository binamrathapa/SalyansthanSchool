using Microsoft.EntityFrameworkCore;
using SalyanthanSchool.Core.DTOs.AcademicYear;
using SalyanthanSchool.Core.DTOs.Common;
using SalyanthanSchool.Core.Entities;
using SalyanthanSchool.Core.Interfaces;
using SalyanthanSchool.WebAPI.Data;

namespace SalyanthanSchool.WebAPI.Services
{
    public class AcademicYearService : IAcademicYearService
    {
        private readonly SalyanthanSchoolWebAPIContext _context;

        public AcademicYearService(SalyanthanSchoolWebAPIContext context)
        {
            _context = context;
        }

        public async Task<PagedResult<AcademicYearResponseDto>> GetAllAsync(AcademicYearQueryParameter query)
        {
            var collection = _context.AcademicYear.AsNoTracking();

            // Apply IsActive filter if provided, just like your Grade reference
            if (query.IsActive.HasValue)
            {
                collection = collection.Where(a => a.IsActive == query.IsActive.Value);
            }

            var totalCount = await collection.CountAsync();

            var items = await collection
                .OrderByDescending(a => a.StartDate)
                .Skip((query.PageNumber - 1) * query.PageSize)
                .Take(query.PageSize)
                .Select(a => new AcademicYearResponseDto
                {
                    Id = a.Id,
                    Name = a.Name,
                    StartDate = DateOnly.FromDateTime(a.StartDate),
                    EndDate = DateOnly.FromDateTime(a.EndDate),
                    IsActive = a.IsActive
                })
                .ToListAsync();

            return new PagedResult<AcademicYearResponseDto>(
                items,
                totalCount,
                query.PageNumber,
                query.PageSize
            );
        }

        public async Task<AcademicYearResponseDto?> GetByIdAsync(int id)
        {
            var year = await _context.AcademicYear.FindAsync(id);
            return year == null ? null : MapToResponse(year);
        }

        public async Task<AcademicYearResponseDto> CreateAsync(AcademicYearRequestDto dto)
        {
            var academicYear = new AcademicYear
            {
                Name = dto.Name,
                StartDate = dto.StartDate.ToDateTime(TimeOnly.MinValue),
                EndDate = dto.EndDate.ToDateTime(TimeOnly.MinValue),
                IsActive = dto.IsActive,
                CreatedAt = DateTime.UtcNow
            };

            _context.AcademicYear.Add(academicYear);
            await _context.SaveChangesAsync();
            return MapToResponse(academicYear);
        }

        public async Task<AcademicYearResponseDto?> UpdateAsync(int id, AcademicYearRequestDto dto)
        {
            var year = await _context.AcademicYear.FindAsync(id);
            if (year == null) return null;

            year.Name = dto.Name;
            year.StartDate = dto.StartDate.ToDateTime(TimeOnly.MinValue);
            year.EndDate = dto.EndDate.ToDateTime(TimeOnly.MinValue);
            year.IsActive = dto.IsActive;
            year.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return MapToResponse(year);
        }

        public async Task<AcademicYearResponseDto?> PatchAsync(int id, AcademicYearPatchDto dto)
        {
            var year = await _context.AcademicYear.FindAsync(id);
            if (year == null) return null;

            if (dto.Name != null) year.Name = dto.Name;
            if (dto.StartDate.HasValue) year.StartDate = dto.StartDate.Value.ToDateTime(TimeOnly.MinValue);
            if (dto.EndDate.HasValue) year.EndDate = dto.EndDate.Value.ToDateTime(TimeOnly.MinValue);
            if (dto.IsActive.HasValue) year.IsActive = dto.IsActive.Value;

            year.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return MapToResponse(year);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var year = await _context.AcademicYear.FindAsync(id);
            if (year == null) return false;

            _context.AcademicYear.Remove(year);
            await _context.SaveChangesAsync();
            return true;
        }

        private static AcademicYearResponseDto MapToResponse(AcademicYear a) => new AcademicYearResponseDto
        {
            Id = a.Id,
            Name = a.Name,
            StartDate = DateOnly.FromDateTime(a.StartDate),
            EndDate = DateOnly.FromDateTime(a.EndDate),
            IsActive = a.IsActive
        };
    }
}