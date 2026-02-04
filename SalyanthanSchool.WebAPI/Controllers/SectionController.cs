using Microsoft.AspNetCore.Mvc;
using SalyanthanSchool.Core.DTOs.Section;
using SalyanthanSchool.Core.Interfaces;
using SalyanthanSchool.Core.DTOs.Common; 
using Microsoft.AspNetCore.Authorization;

namespace SalyanthanSchool.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SectionController : ControllerBase
    {
        private readonly ISectionService _service;

        public SectionController(ISectionService service)
        {
            _service = service;
        }

        // GET: api/Section
        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] SectionQueryParameter query)
        {
            var result = await _service.GetAsync(query);

            return Ok(ApiResponse<IEnumerable<SectionResponseDto>>.Ok(
                data: result.Items,
                message: "Sections fetched successfully",
                meta: new
                {
                    query.PageNumber,
                    query.PageSize,
                    total = result.TotalCount
                }
            ));
        }

        // GET: api/Section/5
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var section = await _service.GetByIdAsync(id);

            if (section == null)
                return NotFound(ApiResponse<SectionResponseDto>.Fail("Section not found"));

            return Ok(ApiResponse<SectionResponseDto>.Ok(section, "Section fetched successfully"));
        }

        // POST: api/Section
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] SectionRequestDto dto)
        {
            try
            {
                var created = await _service.CreateAsync(dto);

                return CreatedAtAction(
                    nameof(GetById),
                    new { id = created.Id },
                    ApiResponse<SectionResponseDto>.Ok(created, "Section created successfully")
                );
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ApiResponse<SectionResponseDto>.Fail(ex.Message));
            }
        }

        // PUT: api/Section/5
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] SectionRequestDto dto)
        {
            try
            {
                var updated = await _service.UpdateAsync(id, dto);

                if (updated == null)
                    return NotFound(ApiResponse<SectionResponseDto>.Fail("Section not found"));

                return Ok(ApiResponse<SectionResponseDto>.Ok(updated, "Section updated successfully"));
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ApiResponse<SectionResponseDto>.Fail(ex.Message));
            }
        }

        // DELETE: api/Section/5
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _service.DeleteAsync(id);

            if (!deleted)
                return NotFound(ApiResponse<bool>.Fail("Section not found"));

            return Ok(ApiResponse<bool>.Ok(true, "Section deleted successfully"));
        }
    }
}