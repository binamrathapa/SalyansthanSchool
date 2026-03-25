using Microsoft.AspNetCore.Mvc;
using SalyanthanSchool.Core.DTOs.FeeStructure;
using SalyanthanSchool.Core.Interfaces;
using SalyanthanSchool.Core.DTOs.Common;

namespace SalyanthanSchool.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FeeStructureController : ControllerBase
    {
        private readonly IFeeStructureService _service;

        public FeeStructureController(IFeeStructureService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] FeeStructureQueryParameter query)
        {
            var result = await _service.GetAsync(query);

            return Ok(ApiResponse<IEnumerable<FeeStructureResponseDto>>.Ok(
                data: result.Items,
                message: "Fee structures fetched successfully",
                meta: new
                {
                    query.PageNumber,
                    query.PageSize,
                    total = result.TotalCount
                }
            ));
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _service.GetByIdAsync(id);

            if (result == null)
                return NotFound(ApiResponse<FeeStructureResponseDto>.Fail("Fee structure not found"));

            return Ok(ApiResponse<FeeStructureResponseDto>.Ok(result, "Fee structure fetched successfully"));
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] FeeStructureRequestDto dto)
        {
            try
            {
                var created = await _service.CreateAsync(dto);
                return CreatedAtAction(
                    nameof(GetById),
                    new { id = created.Id },
                    ApiResponse<FeeStructureResponseDto>.Ok(created, "Fee structure created successfully")
                );
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ApiResponse<FeeStructureResponseDto>.Fail(ex.Message));
            }
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] FeeStructureRequestDto dto)
        {
            var updated = await _service.UpdateAsync(id, dto);

            if (updated == null)
                return NotFound(ApiResponse<FeeStructureResponseDto>.Fail("Fee structure not found"));

            return Ok(ApiResponse<FeeStructureResponseDto>.Ok(updated, "Fee structure updated successfully"));
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _service.DeleteAsync(id);

            if (!deleted)
                return NotFound(ApiResponse<bool>.Fail("Fee structure not found"));

            return Ok(ApiResponse<bool>.Ok(true, "Fee structure deleted successfully"));
        }
    }
}