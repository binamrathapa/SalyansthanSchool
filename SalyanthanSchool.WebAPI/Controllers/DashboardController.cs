using Microsoft.AspNetCore.Mvc;
using SalyanthanSchool.Core.Interfaces;
using System.Threading.Tasks;

namespace SalyanthanSchool.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly IDashboardService _dashboardService;

        public DashboardController(IDashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }

        [HttpGet]
        public async Task<IActionResult> GetDashboardData()
        {
            var data = await _dashboardService.GetDashboardDataAsync();
            return Ok(data);
        }
    }
}
