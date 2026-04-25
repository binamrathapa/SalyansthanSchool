using Microsoft.AspNetCore.Mvc;
using SalyanthanSchool.Core.DTOs.Teacher;
using SalyanthanSchool.Core.Interfaces;
using SalyanthanSchool.Core.DTOs.Common;

namespace SalyanthanSchool.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TeacherController : ControllerBase
    {
        private readonly ITeacherService _service;

        public TeacherController(ITeacherService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] TeacherQueryParameter query)
        {
            var result = await _service.GetAsync(query);
            // Return response in standard API format (matching Student API)
            return Ok(ApiResponse<IEnumerable<TeacherResponseDto>>.Ok(
                data: result.Items,
                message: "Teachers fetched successfully",
                meta: new
                {
                    pageNumber = result.PageNumber,
                    pageSize = result.PageSize,
                    total = result.TotalCount
                }
            ));
        }


        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var teacher = await _service.GetByIdAsync(id);
            if (teacher == null)
                return NotFound(ApiResponse<TeacherResponseDto>.Fail("Teacher not found"));

            return Ok(ApiResponse<TeacherResponseDto>.Ok(teacher));
        }

        [HttpPost]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> Create([FromForm] TeacherRequestDto dto)
        {
            try
            {
                var created = await _service.CreateAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = created.Id }, 
                    ApiResponse<TeacherResponseDto>.Ok(created, "Teacher created successfully"));
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(ApiResponse<TeacherResponseDto>.Fail(ex.Message));
            }
        }

        [HttpPut("{id:int}")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> Update(int id, [FromForm] TeacherRequestDto dto)
        {
            try
            {
                var updated = await _service.UpdateAsync(id, dto);
                if (updated == null)
                    return NotFound(ApiResponse<TeacherResponseDto>.Fail("Teacher not found"));

                return Ok(ApiResponse<TeacherResponseDto>.Ok(updated, "Teacher updated successfully"));
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(ApiResponse<TeacherResponseDto>.Fail(ex.Message));
            }
        }


        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _service.DeleteAsync(id);
            if (!deleted)
                return NotFound(ApiResponse<bool>.Fail("Teacher not found or could not be deleted"));

            return Ok(ApiResponse<bool>.Ok(true, "Teacher deleted successfully"));
        }
    }
}