using Microsoft.EntityFrameworkCore;
using SalyanthanSchool.Core.DTOs.PaymentMode;
using SalyanthanSchool.Core.Entities;
using SalyanthanSchool.Core.Interfaces;
using SalyanthanSchool.WebAPI.Data;

namespace SalyanthanSchool.WebAPI.Services
{
    public class PaymentModeService : IPaymentModeService
    {
        private readonly SalyanthanSchoolWebAPIContext _context;

        public PaymentModeService(SalyanthanSchoolWebAPIContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<PaymentModeResponseDto>> GetAsync(PaymentModeQueryParameter query)
        {
            var collection = _context.PaymentMode.AsNoTracking();

            if (!string.IsNullOrWhiteSpace(query.Name))
                collection = collection.Where(x => x.Name.Contains(query.Name));

            return await collection
                .Skip((query.PageNumber - 1) * query.PageSize)
                .Take(query.PageSize)
                .Select(x => new PaymentModeResponseDto { Id = x.Id, Name = x.Name })
                .ToListAsync();
        }

        public async Task<PaymentModeResponseDto?> GetByIdAsync(int id)
        {
            var mode = await _context.PaymentMode.FindAsync(id);
            return mode == null ? null : new PaymentModeResponseDto { Id = mode.Id, Name = mode.Name };
        }

        public async Task<PaymentModeResponseDto> CreateAsync(PaymentModeRequestDto dto)
        {
            if (await _context.PaymentMode.AnyAsync(x => x.Name == dto.Name))
                throw new InvalidOperationException("Payment mode already exists.");

            var mode = new PaymentMode { Name = dto.Name };
            _context.PaymentMode.Add(mode);
            await _context.SaveChangesAsync();
            return new PaymentModeResponseDto { Id = mode.Id, Name = mode.Name };
        }

        public async Task<PaymentModeResponseDto?> UpdateAsync(int id, PaymentModeRequestDto dto)
        {
            var mode = await _context.PaymentMode.FindAsync(id);
            if (mode == null) return null;

            mode.Name = dto.Name;
            await _context.SaveChangesAsync();
            return new PaymentModeResponseDto { Id = mode.Id, Name = mode.Name };
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var mode = await _context.PaymentMode.FindAsync(id);
            if (mode == null) return false;

            _context.PaymentMode.Remove(mode);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}