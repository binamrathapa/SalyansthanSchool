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
                .Include(s => s.AcademicYear)
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
                    AcademicYearName = x.AcademicYear.Name, // Adjust property name as per your AcademicYear entity
                    DiscountAmount = x.DiscountAmount,
                    ValidFrom = x.ValidFrom,
                    ValidTo = x.ValidTo,
                    IsActive = x.IsActive
                }).ToListAsync();
        }

        public async Task<StudentDiscountResponseDto?> GetByIdAsync(int id)
        {
            return await _context.StudentDiscount
                .Include(s => s.Student)
                .Include(s => s.FeeHead)
                .Include(s => s.AcademicYear)
                .Select(x => new StudentDiscountResponseDto
                {
                    Id = x.Id,
                    StudentId = x.StudentId,
                    StudentName = x.Student.FirstName + " " + x.Student.LastName,
                    FeeHeadName = x.FeeHead.Name,
                    AcademicYearName = x.AcademicYear.Name,
                    DiscountAmount = x.DiscountAmount,
                    ValidFrom = x.ValidFrom,
                    ValidTo = x.ValidTo,
                    IsActive = x.IsActive
                }).FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<StudentDiscountResponseDto> CreateAsync(StudentDiscountRequestDto dto)
        {
            // 1. Conflict Check: Ensure no active overlapping discount for this Student/FeeHead/Year
            bool hasOverlap = await _context.StudentDiscount.AnyAsync(x =>
                x.StudentId == dto.StudentId &&
                x.FeeHeadId == dto.FeeHeadId &&
                x.AcademicYearId == dto.AcademicYearId &&
                x.IsActive &&
                ((dto.ValidFrom <= x.ValidTo && dto.ValidTo >= x.ValidFrom)));

            if (hasOverlap)
                throw new InvalidOperationException("An active discount already exists for this student and fee head within this time range.");

            // 2. Fetch dependencies
            var student = await _context.Student.FindAsync(dto.StudentId)
                ?? throw new InvalidOperationException("Student not found.");

            var feeStructure = await _context.FeeStructure.FirstOrDefaultAsync(x =>
                x.GradeId == student.GradeId &&
                x.FeeHeadId == dto.FeeHeadId &&
                x.AcademicYearId == dto.AcademicYearId)
                ?? throw new InvalidOperationException("No Fee Structure found for this head in student's grade for the selected year.");

            // 3. Calculation
            decimal calculatedAmount = dto.IsPercentage
                ? (feeStructure.Amount * dto.DiscountValue / 100)
                : dto.DiscountValue;

            // Apply Caps: Cannot exceed MaxDiscountAmount provided, and cannot exceed the actual fee
            decimal finalAmount = Math.Min(calculatedAmount, dto.MaxDiscountAmount);
            finalAmount = Math.Min(finalAmount, feeStructure.Amount);

            var entity = new StudentDiscount
            {
                StudentId = dto.StudentId,
                FeeHeadId = dto.FeeHeadId,
                AcademicYearId = dto.AcademicYearId,
                DiscountAmount = finalAmount,
                MaxDiscountAmount = dto.MaxDiscountAmount,
                ValidFrom = dto.ValidFrom,
                ValidTo = dto.ValidTo,
                IsActive = true
            };

            _context.StudentDiscount.Add(entity);
            await _context.SaveChangesAsync();

            return (await GetByIdAsync(entity.Id))!;
        }

        public async Task<bool> ToggleActiveStatusAsync(int id)
        {
            var entity = await _context.StudentDiscount.FindAsync(id);
            if (entity == null) return false;

            entity.IsActive = !entity.IsActive;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var entity = await _context.StudentDiscount.FindAsync(id);
            if (entity == null) return false;

            // Option: Soft delete by setting IsActive = false instead of removing
            _context.StudentDiscount.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}