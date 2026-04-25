using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SalyanthanSchool.Core.DTOs.Common;
using SalyanthanSchool.Core.DTOs.StudentFee;
using SalyanthanSchool.Core.Interfaces;
using SalyanthanSchool.WebAPI.Data;

namespace SalyanthanSchool.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    //[Authorize]
    public class StudentFeeController : ControllerBase
    {
        private readonly IStudentFeeService _studentFeeService;
        private readonly SalyanthanSchoolWebAPIContext _context;
        private readonly ILogger<StudentFeeController> _logger;

        public StudentFeeController(
            IStudentFeeService studentFeeService,
            SalyanthanSchoolWebAPIContext context,
            ILogger<StudentFeeController> logger)
        {
            _studentFeeService = studentFeeService;
            _context           = context;
            _logger            = logger;
        }

        // GET: api/StudentFee/report/1
        // GET: api/StudentFee/report/1?month=3
        [HttpGet("report/{studentId:int}")]
        public async Task<IActionResult> GetFeeReport(
            int studentId,
            [FromQuery] int? month          = null,
            [FromQuery] int? academicYearId = null)
        {
            if (month.HasValue &&
                (month.Value < 1 || month.Value > 12))
            {
                return BadRequest(
                    ApiResponse<List<StudentFeeResponseDto>>.Fail(
                        "Month must be between 1 and 12"));
            }

            try
            {
                var result = await _studentFeeService
                    .GetFeeReportAsync(
                        studentId, month, academicYearId);

                // ✅ Wrap single result in List → becomes []
                var dataList = new List<StudentFeeResponseDto> 
                { 
                    result 
                };

                return Ok(
                    ApiResponse<List<StudentFeeResponseDto>>.Ok(
                        data: dataList,
                        message: "Fee report fetched successfully",
                        meta: new
                        {
                            pageNumber = 1,
                            pageSize   = 1,
                            total      = 1
                        }
                    )
                );
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(
                    ApiResponse<List<StudentFeeResponseDto>>.Fail(
                        ex.Message));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex,
                    "Error fetching fee report for student {Id}",
                    studentId);

                return StatusCode(500,
                    ApiResponse<List<StudentFeeResponseDto>>.Fail(
                        ex.Message));
            }
        }

        // GET: api/StudentFee/reports
        // GET: api/StudentFee/reports?month=3&pageNumber=1&pageSize=30
        [HttpGet("reports")]
        public async Task<IActionResult> GetAllFeeReports(
            [FromQuery] int? month          = null,
            [FromQuery] int? academicYearId = null,
            [FromQuery] int  pageNumber     = 1,
            [FromQuery] int  pageSize       = 30)
        {
            if (month.HasValue &&
                (month.Value < 1 || month.Value > 12))
            {
                return BadRequest(
                    ApiResponse<List<StudentFeeResponseDto>>.Fail(
                        "Month must be between 1 and 12"));
            }

            try
            {
                // Get total count for meta
                var total = await _context.Student
                    .Where(s => s.IsActive == true)
                    .CountAsync();

                // ✅ Already returns List → becomes []
                var reports = await _studentFeeService
                    .GetAllFeeReportsAsync(
                        month, academicYearId, pageNumber, pageSize);

                return Ok(
                    ApiResponse<List<StudentFeeResponseDto>>.Ok(
                        data: reports,
                        message: "Fee reports fetched successfully",
                        meta: new
                        {
                            pageNumber = pageNumber,
                            pageSize   = pageSize,
                            total      = total
                        }
                    )
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex,
                    "Error fetching all fee reports");

                return StatusCode(500,
                    ApiResponse<List<StudentFeeResponseDto>>.Fail(
                        ex.Message));
            }
        }
    }
}