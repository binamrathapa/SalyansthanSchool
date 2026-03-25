using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SalyanthanSchool.Core.DTOs.AcademicYear;
using SalyanthanSchool.Core.Interfaces;
using SalyanthanSchool.Core.DTOs.Common;

namespace SalyanthanSchool.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize]
    public class AcademicYearController : ControllerBase
    {
        private readonly IAcademicYearService _service;

        public AcademicYearController(IAcademicYearService service)
        {
            _service = service;
        }

        // GET: api/AcademicYear
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] AcademicYearQueryParameter query)
        {
            var result = await _service.GetAllAsync(query);

            return Ok(ApiResponse<IEnumerable<AcademicYearResponseDto>>.Ok(
                data: result.Items,
                message: "Academic years fetched successfully",
                meta: new
                {
                    query.PageNumber,
                    query.PageSize,
                    total = result.TotalCount,
                    query.IsActive
                }
            ));
        }

        // GET: api/AcademicYear/5
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _service.GetByIdAsync(id);

            if (result == null)
                return NotFound(ApiResponse<AcademicYearResponseDto>.Fail("Academic year not found"));

            return Ok(ApiResponse<AcademicYearResponseDto>.Ok(result, "Academic year fetched successfully"));
        }

        // POST: api/AcademicYear
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] AcademicYearRequestDto dto)
        {
            try
            {
                var created = await _service.CreateAsync(dto);

                return CreatedAtAction(
                    nameof(GetById),
                    new { id = created.Id },
                    ApiResponse<AcademicYearResponseDto>.Ok(created, "Academic year created successfully")
                );
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ApiResponse<AcademicYearResponseDto>.Fail(ex.Message));
            }
        }

        // PUT: api/AcademicYear/5
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] AcademicYearRequestDto dto)
        {
            var updated = await _service.UpdateAsync(id, dto);

            if (updated == null)
                return NotFound(ApiResponse<AcademicYearResponseDto>.Fail("Academic year not found"));

            return Ok(ApiResponse<AcademicYearResponseDto>.Ok(updated, "Academic year updated successfully"));
        }

        // PATCH: api/AcademicYear/5
        [HttpPatch("{id:int}")]
        public async Task<IActionResult> Patch(int id, [FromBody] AcademicYearPatchDto dto)
        {
            var patched = await _service.PatchAsync(id, dto);

            if (patched == null)
                return NotFound(ApiResponse<AcademicYearResponseDto>.Fail("Academic year not found"));

            return Ok(ApiResponse<AcademicYearResponseDto>.Ok(patched, "Academic year updated successfully"));
        }

        // DELETE: api/AcademicYear/5
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _service.DeleteAsync(id);

            if (!deleted)
                return NotFound(ApiResponse<bool>.Fail("Academic year not found"));

            return Ok(ApiResponse<bool>.Ok(true, "Academic year deleted successfully"));
        }
    }
}