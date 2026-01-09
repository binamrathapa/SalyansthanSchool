using Microsoft.EntityFrameworkCore;
using SalyanthanSchool.Core.DTOs.FeeStructure;
using SalyanthanSchool.Core.Entities;
using SalyanthanSchool.Core.Interfaces;
using SalyanthanSchool.WebAPI.Data;

namespace SalyanthanSchool.WebAPI.Services
{
    public class FeeStructureService : IFeeStructureService
    {
        private readonly SalyanthanSchoolWebAPIContext _context;

        public FeeStructureService(SalyanthanSchoolWebAPIContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<FeeStructureResponseDto>> GetAsync(FeeStructureQueryParameter query)
        {
            var collection = _context.FeeStructure
                .Include(x => x.AcademicYear)
                .Include(x => x.Grade)
                .Include(x => x.FeeHead)
                .AsNoTracking();

            if (query.AcademicYearId.HasValue)
                collection = collection.Where(x => x.AcademicYearId == query.AcademicYearId);

            if (query.GradeId.HasValue)
                collection = collection.Where(x => x.GradeId == query.GradeId);

            return await collection
                .Skip((query.PageNumber - 1) * query.PageSize)
                .Take(query.PageSize)
                .Select(x => new FeeStructureResponseDto
                {
                    Id = x.Id,
                    AcademicYearName = x.AcademicYear.Name,
                    GradeName = x.Grade.Name,
                    FeeHeadName = x.FeeHead.Name,
                    Amount = x.Amount,
                    IsMonthly = x.IsMonthly,
                    CreatedAt = x.CreatedAt
                }).ToListAsync();
        }

        public async Task<FeeStructureResponseDto?> GetByIdAsync(int id)
        {
            return await _context.FeeStructure
                .Include(x => x.AcademicYear).Include(x => x.Grade).Include(x => x.FeeHead)
                .Select(x => new FeeStructureResponseDto
                {
                    Id = x.Id,
                    AcademicYearName = x.AcademicYear.Name,
                    GradeName = x.Grade.Name,
                    FeeHeadName = x.FeeHead.Name,
                    Amount = x.Amount,
                    IsMonthly = x.IsMonthly,
                    CreatedAt = x.CreatedAt
                }).FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<FeeStructureResponseDto> CreateAsync(FeeStructureRequestDto dto)
        {
            // Check if this specific head is already defined for this grade and year
            var exists = await _context.FeeStructure.AnyAsync(x =>
                x.AcademicYearId == dto.AcademicYearId &&
                x.GradeId == dto.GradeId &&
                x.FeeHeadId == dto.FeeHeadId);

            if (exists) throw new InvalidOperationException("Fee structure for this head already exists for this grade/year.");

            var entity = new FeeStructure
            {
                AcademicYearId = dto.AcademicYearId,
                GradeId = dto.GradeId,
                FeeHeadId = dto.FeeHeadId,
                Amount = dto.Amount,
                IsMonthly = dto.IsMonthly
            };

            _context.FeeStructure.Add(entity);
            await _context.SaveChangesAsync();
            return (await GetByIdAsync(entity.Id))!;
        }

        public async Task<FeeStructureResponseDto?> UpdateAsync(int id, FeeStructureRequestDto dto)
        {
            var entity = await _context.FeeStructure.FindAsync(id);
            if (entity == null) return null;

            entity.Amount = dto.Amount;
            entity.IsMonthly = dto.IsMonthly;

            await _context.SaveChangesAsync();
            return await GetByIdAsync(id);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var entity = await _context.FeeStructure.FindAsync(id);
            if (entity == null) return false;
            _context.FeeStructure.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}