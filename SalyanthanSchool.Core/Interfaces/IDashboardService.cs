using SalyanthanSchool.Core.DTOs.Dashboard;
using System.Threading.Tasks;

namespace SalyanthanSchool.Core.Interfaces
{
    public interface IDashboardService
    {
        Task<DashboardDto> GetDashboardDataAsync();
    }
}
