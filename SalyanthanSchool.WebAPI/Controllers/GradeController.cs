using Microsoft.AspNetCore.Mvc;
using SalyanthanSchool.Core.DTOs.Grade;
using SalyanthanSchool.Core.Interfaces;
using SalyanthanSchool.Core.DTOs.Common;
using Microsoft.AspNetCore.Authorization;

namespace SalyanthanSchool.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    //[Authorize] 
    public class GradeController : ControllerBase
    {
        private readonly IGradeService _service;

        public GradeController(IGradeService service)
        {
            _service = service;
        }

        // Fetches a paged list of grades, each containing its associated sections
        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] GradeQueryParameter query)
        {
            var result = await _service.GetAsync(query);

            return Ok(ApiResponse<IEnumerable<GradeResponseDto>>.Ok(
                data: result.Items,
                message: "Grades with sections fetched successfully",
                meta: new
                {
                    query.PageNumber,
                    query.PageSize,
                    total = result.TotalCount
                }
            ));
        }

        // Fetches a specific grade and all its sections by the grade's database ID.

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var grade = await _service.GetByIdAsync(id);

            if (grade == null)
                return NotFound(ApiResponse<GradeResponseDto>.Fail("Grade not found"));

            return Ok(ApiResponse<GradeResponseDto>.Ok(
                grade,
                "Grade fetched successfully"
            ));
        }


        /// Creates a new Grade-Section entry.

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] GradeRequestDto dto)
        {
            try
            {
                var created = await _service.CreateAsync(dto);

                return CreatedAtAction(
                    nameof(GetById),
                    new { id = created.Id },
                    ApiResponse<GradeResponseDto>.Ok(created, "Grade created successfully")
                );
            }
            catch (InvalidOperationException ex)
            {
                // Handles duplicate names or missing sections
                return BadRequest(ApiResponse<GradeResponseDto>.Fail(ex.Message));
            }
        }


        /// Updates an existing Grade-Section entry
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] GradeRequestDto dto)
        {
            try
            {
                var updated = await _service.UpdateAsync(id, dto);

                if (updated == null)
                    return NotFound(ApiResponse<GradeResponseDto>.Fail("Grade not found"));

                return Ok(ApiResponse<GradeResponseDto>.Ok(updated, "Grade updated successfully"));
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ApiResponse<GradeResponseDto>.Fail(ex.Message));
            }
        }

        // Deletes a specific Grade-Section entry.
        
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _service.DeleteAsync(id);

            if (!deleted)
                return NotFound(ApiResponse<bool>.Fail("Grade not found"));

            return Ok(ApiResponse<bool>.Ok(true, "Grade deleted successfully"));
        }
    }
}