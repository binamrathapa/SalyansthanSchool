using SalyanthanSchool.Core.DTOs.StudentFee;

namespace SalyanthanSchool.Core.Interfaces
{
    public interface IStudentFeeService
    {
        // Single student fee report
        Task<StudentFeeResponseDto> GetFeeReportAsync(
            int studentId,
            int? month = null);

        // All students fee reports
        Task<List<StudentFeeResponseDto>> GetAllFeeReportsAsync(
            int? month      = null,
            int  pageNumber = 1,
            int  pageSize   = 30);
    }
}