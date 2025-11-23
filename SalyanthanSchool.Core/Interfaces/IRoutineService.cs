using System.Collections.Generic;
using System.Threading.Tasks;
using SalyanthanSchool.Core.DTOs;


namespace SalyanthanSchool.Core.Interfaces
{
    public interface IRoutineService
    {
        Task<IEnumerable<RoutineDTO>> GetAllAsync();
        Task<RoutineDTO?> GetByIdAsync(int id);
        Task<RoutineDTO> CreateAsync(RoutineDTO dto);
        Task<RoutineDTO?> UpdateAsync(int id, RoutineDTO dto);
        Task<bool> DeleteAsync(int id);
        Task<PagedResult<RoutineDTO>> GetPagedAsync(int pageNumber, int pageSize = 30);
    }
}