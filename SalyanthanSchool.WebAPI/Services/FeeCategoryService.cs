using Microsoft.EntityFrameworkCore;
using SalyanthanSchool.Core.DTOs.Account.FeeCategory;
using SalyanthanSchool.Core.DTOs.FeeCategory;
using SalyanthanSchool.Core.DTOs.FeeCategory.SalyanthanSchool.Core.DTOs.Account.FeeCategory;
using SalyanthanSchool.Core.Entities;
using SalyanthanSchool.Core.Interfaces;
using SalyanthanSchool.WebAPI.Data;

namespace SalyanthanSchool.WebAPI.Services
{
    public class FeeCategoryService : IFeeCategoryService
    {
        private readonly SalyanthanSchoolWebAPIContext _context;

        public FeeCategoryService(SalyanthanSchoolWebAPIContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<FeeCategoryResponseDto>> GetAllAsync(FeeCategoryQueryParameter query)
        {
            var collection = _context.FeeCategory.AsNoTracking();

            // Apply search filter if provided
            if (!string.IsNullOrWhiteSpace(query.Name))
            {
                collection = collection.Where(c => c.Name.Contains(query.Name));
            }

            // Pagination logic
            return await collection
                .Skip((query.PageNumber - 1) * query.PageSize)
                .Take(query.PageSize)
                .Select(c => new FeeCategoryResponseDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    CreatedAt = c.CreatedAt
                })
                .ToListAsync();
        }

        public async Task<FeeCategoryResponseDto?> GetByIdAsync(int id)
        {
            var category = await _context.FeeCategory.FindAsync(id);
            if (category == null) return null;

            return new FeeCategoryResponseDto { Id = category.Id, Name = category.Name, CreatedAt = category.CreatedAt };
        }

        public async Task<FeeCategoryResponseDto> CreateAsync(FeeCategoryRequestDto dto)
        {
            if (await _context.FeeCategory.AnyAsync(x => x.Name == dto.Name))
                throw new InvalidOperationException("Fee Category with this name already exists.");

            var category = new FeeCategory { Name = dto.Name, CreatedAt = DateTime.Now };
            _context.FeeCategory.Add(category);
            await _context.SaveChangesAsync();

            return new FeeCategoryResponseDto { Id = category.Id, Name = category.Name, CreatedAt = category.CreatedAt };
        }

        public async Task<FeeCategoryResponseDto?> UpdateAsync(int id, FeeCategoryRequestDto dto)
        {
            var category = await _context.FeeCategory.FindAsync(id);
            if (category == null) return null;

            // Check if name is being changed to something that already exists
            if (await _context.FeeCategory.AnyAsync(x => x.Name == dto.Name && x.Id != id))
                throw new InvalidOperationException("Another category already has this name.");

            category.Name = dto.Name;
            await _context.SaveChangesAsync();

            return new FeeCategoryResponseDto { Id = category.Id, Name = category.Name, CreatedAt = category.CreatedAt };
        }

        public async Task<bool> PatchAsync(int id, string name)
        {
            var category = await _context.FeeCategory.FindAsync(id);
            if (category == null) return false;

            category.Name = name;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var category = await _context.FeeCategory.FindAsync(id);
            if (category == null) return false;

            _context.FeeCategory.Remove(category);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}