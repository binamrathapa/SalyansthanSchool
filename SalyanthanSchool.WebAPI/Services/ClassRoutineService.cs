using Microsoft.EntityFrameworkCore;
using SalyanthanSchool.Core.DTOs.Common;
using SalyanthanSchool.Core.DTOs.ClassRoutine;
using SalyanthanSchool.Core.Entities;
using SalyanthanSchool.Core.Interfaces;
using SalyanthanSchool.WebAPI.Data;

namespace SalyanthanSchool.Infrastructure.Services
{
    public class ClassRoutineService : IClassRoutineService
    {
        private readonly SalyanthanSchoolWebAPIContext _context;

        public ClassRoutineService(SalyanthanSchoolWebAPIContext context)
        {
            _context = context;
        }

        // Helper method to include all navigation properties
        private IQueryable<ClassRoutine> GetRoutineQuery()
        {
            return _context.ClassRoutines
                .Include(cr => cr.Grade)
                .Include(cr => cr.Section)
                .Include(cr => cr.Subject)
                .Include(cr => cr.Teacher)
                .AsNoTracking();
        }

        // Static helper to map Entity (with navigation props) to DTO
        private static ClassRoutineResponseDto MapToResponse(ClassRoutine cr)
        {
            return new ClassRoutineResponseDto
            {
                Id = cr.Id,
                GradeId = cr.GradeId,
                GradeName = cr.Grade.Name,
                SectionId = cr.SectionId,
                SectionName = cr.Section?.SectionName,
                SubjectId = cr.SubjectId,
                SubjectName = cr.Subject.Name,
                TeacherId = cr.TeacherId,
                TeacherFullName = $"{cr.Teacher.FirstName} {cr.Teacher.LastName}",
                DayOfWeek = cr.DayOfWeek,
                StartTime = cr.StartTime,
                EndTime = cr.EndTime,
                CreatedAt = cr.CreatedAt
            };
        }

        // Utility to check for time overlaps
        private async Task<bool> IsOverlap(
            int? routineId, int gradeId, int? sectionId, int teacherId, string dayOfWeek,
            TimeOnly startTime, TimeOnly endTime)
        {
            // 1. Check for conflicts within the same grade/section (class schedule conflict)
            var classConflictQuery = _context.ClassRoutines.Where(cr =>
                cr.GradeId == gradeId &&
                cr.DayOfWeek == dayOfWeek &&
                cr.Id != routineId.GetValueOrDefault() &&
                ((cr.SectionId == sectionId) || (cr.SectionId == null && sectionId == null)) && // Handle nullable section
                (
                    // New schedule starts during an existing class
                    (startTime >= cr.StartTime && startTime < cr.EndTime) ||
                    // New schedule ends during an existing class
                    (endTime > cr.StartTime && endTime <= cr.EndTime) ||
                    // Existing class is entirely within the new schedule
                    (cr.StartTime >= startTime && cr.EndTime <= endTime)
                ));

            if (await classConflictQuery.AnyAsync()) return true;

            // 2. Check for conflicts for the assigned teacher (teacher busy conflict)
            var teacherConflictQuery = _context.ClassRoutines.Where(cr =>
                cr.TeacherId == teacherId &&
                cr.DayOfWeek == dayOfWeek &&
                cr.Id != routineId.GetValueOrDefault() &&
                (
                    (startTime >= cr.StartTime && startTime < cr.EndTime) ||
                    (endTime > cr.StartTime && endTime <= cr.EndTime) ||
                    (cr.StartTime >= startTime && cr.EndTime <= endTime)
                ));

            if (await teacherConflictQuery.AnyAsync()) return true;

            return false;
        }

        // -----------------------------
        // GET (Paged + Filter + Sort)
        // -----------------------------
        public async Task<PagedResult<ClassRoutineResponseDto>> GetAsync(
            ClassRoutineQueryParameter query)
        {
            var routines = GetRoutineQuery();

            // -------- Filter --------
            if (query.GradeId.HasValue) routines = routines.Where(cr => cr.GradeId == query.GradeId);
            if (query.SectionId.HasValue) routines = routines.Where(cr => cr.SectionId == query.SectionId);
            if (query.SubjectId.HasValue) routines = routines.Where(cr => cr.SubjectId == query.SubjectId);
            if (query.TeacherId.HasValue) routines = routines.Where(cr => cr.TeacherId == query.TeacherId);
            if (!string.IsNullOrWhiteSpace(query.DayOfWeek)) routines = routines.Where(cr => cr.DayOfWeek.ToLower() == query.DayOfWeek.ToLower());

            // Search is simple on names
            if (!string.IsNullOrWhiteSpace(query.Search))
            {
                routines = routines.Where(cr =>
                    cr.Subject.Name.Contains(query.Search) ||
                    cr.Teacher.FirstName.Contains(query.Search) ||
                    cr.Teacher.LastName.Contains(query.Search));
            }

            // -------- Sorting --------
            routines = query.SortBy.ToLower() switch
            {
                "dayofweek" => query.SortDir == "desc"
                    ? routines.OrderByDescending(cr => cr.DayOfWeek).ThenByDescending(cr => cr.StartTime)
                    : routines.OrderBy(cr => cr.DayOfWeek).ThenBy(cr => cr.StartTime),

                "gradename" => query.SortDir == "desc"
                    ? routines.OrderByDescending(cr => cr.Grade.Name)
                    : routines.OrderBy(cr => cr.Grade.Name),

                _ => query.SortDir == "desc"
                    ? routines.OrderByDescending(cr => cr.Id)
                    : routines.OrderBy(cr => cr.Id)
            };

            // -------- Paging --------
            var totalCount = await routines.CountAsync();

            var items = await routines
                .Skip((query.PageNumber - 1) * query.PageSize)
                .Take(query.PageSize)
                .Select(cr => MapToResponse(cr))
                .ToListAsync();

            return new PagedResult<ClassRoutineResponseDto>(
                items,
                totalCount,
                query.PageNumber,
                query.PageSize
            );
        }

        // -----------------------------
        // GET BY ID
        // -----------------------------
        public async Task<ClassRoutineResponseDto?> GetByIdAsync(int id)
        {
            var routine = await GetRoutineQuery().FirstOrDefaultAsync(cr => cr.Id == id);
            return routine == null ? null : MapToResponse(routine);
        }

        // -----------------------------
        // CREATE
        // -----------------------------
        public async Task<ClassRoutineResponseDto> CreateAsync(ClassRoutineRequestDto dto)
        {
            // 1. Validate FKs exist
            if (!await _context.Grade.AnyAsync(g => g.Id == dto.GradeId))
                throw new InvalidOperationException($"Grade ID {dto.GradeId} not found.");
            if (dto.SectionId.HasValue && !await _context.Section.AnyAsync(s => s.Id == dto.SectionId))
                throw new InvalidOperationException($"Section ID {dto.SectionId} not found.");
            if (!await _context.Subject.AnyAsync(s => s.Id == dto.SubjectId))
                throw new InvalidOperationException($"Subject ID {dto.SubjectId} not found.");
            if (!await _context.Teachers.AnyAsync(t => t.Id == dto.TeacherId))
                throw new InvalidOperationException($"Teacher ID {dto.TeacherId} not found.");

            // 2. Validate Schedule Overlap
            if (await IsOverlap(
                null, dto.GradeId, dto.SectionId, dto.TeacherId, dto.DayOfWeek, dto.StartTime, dto.EndTime))
            {
                throw new InvalidOperationException("Schedule conflict detected: Class or Teacher is already booked during this time.");
            }

            var routine = new ClassRoutine
            {
                GradeId = dto.GradeId,
                SectionId = dto.SectionId,
                SubjectId = dto.SubjectId,
                TeacherId = dto.TeacherId,
                DayOfWeek = dto.DayOfWeek,
                StartTime = dto.StartTime,
                EndTime = dto.EndTime
            };

            _context.ClassRoutines.Add(routine);
            await _context.SaveChangesAsync();

            // Fetch the created routine with navigation properties for the response
            return (await GetByIdAsync(routine.Id))!;
        }

        // -----------------------------
        // UPDATE
        // -----------------------------
        public async Task<ClassRoutineResponseDto?> UpdateAsync(
            int id,
            ClassRoutineRequestDto dto)
        {
            var routine = await _context.ClassRoutines.FindAsync(id);
            if (routine == null) return null;

            // 1. Validate FKs exist
            if (!await _context.Grade.AnyAsync(g => g.Id == dto.GradeId))
                throw new InvalidOperationException($"Grade ID {dto.GradeId} not found.");
            if (dto.SectionId.HasValue && !await _context.Section.AnyAsync(s => s.Id == dto.SectionId))
                throw new InvalidOperationException($"Section ID {dto.SectionId} not found.");
            if (!await _context.Subject.AnyAsync(s => s.Id == dto.SubjectId))
                throw new InvalidOperationException($"Subject ID {dto.SubjectId} not found.");
            if (!await _context.Teachers.AnyAsync(t => t.Id == dto.TeacherId))
                throw new InvalidOperationException($"Teacher ID {dto.TeacherId} not found.");

            // 2. Validate Schedule Overlap (passing ID to exclude current routine)
            if (await IsOverlap(
                id, dto.GradeId, dto.SectionId, dto.TeacherId, dto.DayOfWeek, dto.StartTime, dto.EndTime))
            {
                throw new InvalidOperationException("Schedule conflict detected: Class or Teacher is already booked during this time.");
            }

            // Update properties
            routine.GradeId = dto.GradeId;
            routine.SectionId = dto.SectionId;
            routine.SubjectId = dto.SubjectId;
            routine.TeacherId = dto.TeacherId;
            routine.DayOfWeek = dto.DayOfWeek;
            routine.StartTime = dto.StartTime;
            routine.EndTime = dto.EndTime;
            routine.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return (await GetByIdAsync(routine.Id))!;
        }

        // -----------------------------
        // DELETE
        // -----------------------------
        public async Task<bool> DeleteAsync(int id)
        {
            var routine = await _context.ClassRoutines.FindAsync(id);
            if (routine == null) return false;

            _context.ClassRoutines.Remove(routine);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}