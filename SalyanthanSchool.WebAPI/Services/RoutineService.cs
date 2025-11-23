using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SalyanthanSchool.Core.DTOs;
using SalyanthanSchool.Core.Entities;
using SalyanthanSchool.Core.Interfaces;
using SalyanthanSchool.WebAPI.Data;

namespace SalyanthanSchool.Core.Services
{
    public class RoutineService : IRoutineService
    {
        private readonly SalyanthanSchoolWebAPIContext _context;

        public RoutineService(SalyanthanSchoolWebAPIContext context)
        {
            _context = context;
        }

        // ---------------------------
        // Get all routines
        // ---------------------------
        public async Task<IEnumerable<RoutineDTO>> GetAllAsync()
        {
            return await _context.Routines
                .OrderBy(r => r.Id)
                .Select(r => MapToDTO(r))
                .ToListAsync();
        }

        // ---------------------------
        // Get by id
        // ---------------------------
        public async Task<RoutineDTO?> GetByIdAsync(int id)
        {
            var r = await _context.Routines.FindAsync(id);
            return r == null ? null : MapToDTO(r);
        }

        // ---------------------------
        // Create
        // ---------------------------
        public async Task<RoutineDTO> CreateAsync(RoutineDTO dto)
        {
            var entity = new Routine
            {
                TimeSlot = dto.TimeSlot,
                Priority = dto.Priority
            };

            _context.Routines.Add(entity);
            await _context.SaveChangesAsync();

            dto.Id = entity.Id;
            return dto;
        }

        // ---------------------------
        // Update
        // ---------------------------
        public async Task<RoutineDTO?> UpdateAsync(int id, RoutineDTO dto)
        {
            var entity = await _context.Routines.FindAsync(id);
            if (entity == null) return null;

            entity.TimeSlot = dto.TimeSlot;
            entity.Priority = dto.Priority;

            await _context.SaveChangesAsync();

            dto.Id = entity.Id;
            return dto;
        }

        // ---------------------------
        // Delete
        // ---------------------------
        public async Task<bool> DeleteAsync(int id)
        {
            var entity = await _context.Routines.FindAsync(id);
            if (entity == null) return false;

            _context.Routines.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }

        // ---------------------------
        // Pagination
        // ---------------------------
        public async Task<PagedResult<RoutineDTO>> GetPagedAsync(int pageNumber, int pageSize = 30)
        {
            if (pageNumber < 1) pageNumber = 1;

            var total = await _context.Routines.CountAsync();
            var skip = (pageNumber - 1) * pageSize;

            var data = await _context.Routines
                .OrderBy(r => r.Id)
                .Skip(skip)
                .Take(pageSize)
                .Select(r => MapToDTO(r))
                .ToListAsync();

            return new PagedResult<RoutineDTO>
            {
                Data = data,
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalRecords = total
            };
        }

        // ---------------------------
        // Mapping helper
        // ---------------------------
        private static RoutineDTO MapToDTO(Routine r)
        {
            return new RoutineDTO
            {
                Id = r.Id,
                TimeSlot = r.TimeSlot,
                Priority = r.Priority
            };
        }
    }
}
