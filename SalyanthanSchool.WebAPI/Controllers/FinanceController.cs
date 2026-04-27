using Microsoft.AspNetCore.Mvc;
using SalyanthanSchool.Core.Interfaces;
using System.Threading.Tasks;
using SalyanthanSchool.Core.DTOs.Common;
using SalyanthanSchool.Core.DTOs.Finance;

namespace SalyanthanSchool.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FinanceController : ControllerBase
    {
        private readonly IFinanceService _financeService;

        public FinanceController(IFinanceService financeService)
        {
            _financeService = financeService;
        }

        [HttpGet("dashboard")]
        public async Task<IActionResult> GetDashboard([FromQuery] int? year)
        {
            var data = await _financeService.GetFinanceDashboardDataAsync(year);
            return Ok(ApiResponse<FinanceDashboardDto>.Ok(data, "Finance dashboard data fetched successfully"));
        }
    }
}
