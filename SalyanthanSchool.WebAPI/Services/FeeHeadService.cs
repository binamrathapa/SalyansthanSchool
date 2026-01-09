using Microsoft.EntityFrameworkCore;
using SalyanthanSchool.Core.DTOs.FeeHead;
using SalyanthanSchool.Core.Entities;
using SalyanthanSchool.Core.Interfaces;
using SalyanthanSchool.WebAPI.Data;

namespace SalyanthanSchool.WebAPI.Services
{
    public class FeeHeadService : IFeeHeadService
    {
        private readonly SalyanthanSchoolWebAPIContext _context;

        public FeeHeadService(SalyanthanSchoolWebAPIContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<FeeHeadResponseDto>> GetAsync(FeeHeadQueryParameter query)
        {
            var collection = _context.FeeHead.Include(f => f.FeeCategory).AsNoTracking();

            if (query.FeeCategoryId.HasValue)
                collection = collection.Where(f => f.FeeCategoryId == query.FeeCategoryId);

            if (!string.IsNullOrWhiteSpace(query.Name))
                collection = collection.Where(f => f.Name.Contains(query.Name));

            return await collection
                .Skip((query.PageNumber - 1) * query.PageSize)
                .Take(query.PageSize)
                .Select(f => new FeeHeadResponseDto
                {
                    Id = f.Id,
                    FeeCategoryId = f.FeeCategoryId,
                    FeeCategoryName = f.FeeCategory.Name,
                    Name = f.Name,
                    CreatedAt = f.CreatedAt
                }).ToListAsync();
        }

        public async Task<FeeHeadResponseDto?> GetByIdAsync(int id)
        {
            return await _context.FeeHead
                .Include(f => f.FeeCategory)
                .Select(f => new FeeHeadResponseDto
                {
                    Id = f.Id,
                    FeeCategoryId = f.FeeCategoryId,
                    FeeCategoryName = f.FeeCategory.Name,
                    Name = f.Name,
                    CreatedAt = f.CreatedAt
                }).FirstOrDefaultAsync(f => f.Id == id);
        }

        public async Task<FeeHeadResponseDto> CreateAsync(FeeHeadRequestDto dto)
        {
            var categoryExists = await _context.FeeCategory.AnyAsync(x => x.Id == dto.FeeCategoryId);
            if (!categoryExists)
            {
                throw new InvalidOperationException("The selected Fee Category does not exist.");
            }

            var duplicateExists = await _context.FeeHead.AnyAsync(x => x.Name == dto.Name && x.FeeCategoryId == dto.FeeCategoryId);
            if (duplicateExists)
            {
                throw new InvalidOperationException("A Fee Head with this name already exists in this category.");
            }

            var head = new FeeHead
            {
                Name = dto.Name,
                FeeCategoryId = dto.FeeCategoryId,
                CreatedAt = DateTime.Now
            };

            _context.FeeHead.Add(head);
            await _context.SaveChangesAsync();
            return (await GetByIdAsync(head.Id))!;
        }
        public async Task<FeeHeadResponseDto?> UpdateAsync(int id, FeeHeadRequestDto dto)
        {
            var head = await _context.FeeHead.FindAsync(id);
            if (head == null) return null;

            head.Name = dto.Name;
            head.FeeCategoryId = dto.FeeCategoryId;

            await _context.SaveChangesAsync();
            return await GetByIdAsync(id);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var head = await _context.FeeHead.FindAsync(id);
            if (head == null) return false;

            _context.FeeHead.Remove(head);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}