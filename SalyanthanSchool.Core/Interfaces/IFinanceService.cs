using System.Threading.Tasks;
using SalyanthanSchool.Core.DTOs.Finance;

namespace SalyanthanSchool.Core.Interfaces
{
    public interface IFinanceService
    {
        Task<FinanceDashboardDto> GetFinanceDashboardDataAsync(int? year = null);
    }
}
