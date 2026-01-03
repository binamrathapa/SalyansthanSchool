using Microsoft.EntityFrameworkCore;
using SalyanthanSchool.Core.DTOs.StudentDiscount;
using SalyanthanSchool.Core.Entities;
using SalyanthanSchool.Core.Interfaces;
using SalyanthanSchool.WebAPI.Data;

namespace SalyanthanSchool.WebAPI.Services
{
    public class StudentDiscountService : IStudentDiscountService
    {
        private readonly SalyanthanSchoolWebAPIContext _context;

        public StudentDiscountService(SalyanthanSchoolWebAPIContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<StudentDiscountResponseDto>> GetAsync(StudentDiscountQueryParameter query)
        {
            var collection = _context.StudentDiscount
                .Include(s => s.Student)
                .Include(s => s.FeeHead)
                .AsNoTracking();

            if (query.StudentId.HasValue)
                collection = collection.Where(x => x.StudentId == query.StudentId);

            return await collection
                .Skip((query.PageNumber - 1) * query.PageSize)
                .Take(query.PageSize)
                .Select(x => new StudentDiscountResponseDto
                {
                    Id = x.Id,
                    StudentId = x.StudentId,
                    StudentName = x.Student.FirstName + " " + x.Student.LastName,
                    FeeHeadName = x.FeeHead.Name,
                    DiscountAmount = x.DiscountAmount
                }).ToListAsync();
        }

        public async Task<StudentDiscountResponseDto?> GetByIdAsync(int id)
        {
            return await _context.StudentDiscount
                .Include(s => s.Student).Include(s => s.FeeHead)
                .Select(x => new StudentDiscountResponseDto
                {
                    Id = x.Id,
                    StudentId = x.StudentId,
                    StudentName = x.Student.FirstName + " " + x.Student.LastName,
                    FeeHeadName = x.FeeHead.Name,
                    DiscountAmount = x.DiscountAmount
                }).FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<StudentDiscountResponseDto> CreateAsync(StudentDiscountRequestDto dto)
        {
            // Requirement: Calculate amount from % and save as amount
            var student = await _context.Student.FindAsync(dto.StudentId);
            if (student == null) throw new InvalidOperationException("Student not found.");

            var feeStructure = await _context.FeeStructure
                .FirstOrDefaultAsync(x => x.GradeId == student.GradeId && x.FeeHeadId == dto.FeeHeadId);

            if (feeStructure == null)
                throw new InvalidOperationException("No Fee Structure found for this head in student's grade.");

            decimal calculatedAmount = dto.IsPercentage
                ? (feeStructure.Amount * dto.DiscountValue / 100)
                : dto.DiscountValue;

            var entity = new StudentDiscount
            {
                StudentId = dto.StudentId,
                FeeHeadId = dto.FeeHeadId,
                DiscountAmount = calculatedAmount
            };

            _context.StudentDiscount.Add(entity);
            await _context.SaveChangesAsync();
            return (await GetByIdAsync(entity.Id))!;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var entity = await _context.StudentDiscount.FindAsync(id);
            if (entity == null) return false;
            _context.StudentDiscount.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}