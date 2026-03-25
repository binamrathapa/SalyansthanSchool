using Microsoft.AspNetCore.Mvc;
using SalyanthanSchool.Core.DTOs.FeeHead;
using SalyanthanSchool.Core.Interfaces;
using SalyanthanSchool.Core.DTOs.Common;

namespace SalyanthanSchool.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FeeHeadController : ControllerBase
    {
        private readonly IFeeHeadService _service;

        public FeeHeadController(IFeeHeadService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] FeeHeadQueryParameter query)
        {
            var result = await _service.GetAsync(query);

            return Ok(ApiResponse<IEnumerable<FeeHeadResponseDto>>.Ok(
                data: result.Items,
                message: "Fee heads fetched successfully",
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
            var head = await _service.GetByIdAsync(id);

            if (head == null)
                return NotFound(ApiResponse<FeeHeadResponseDto>.Fail("Fee head not found"));

            return Ok(ApiResponse<FeeHeadResponseDto>.Ok(head, "Fee head fetched successfully"));
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] FeeHeadRequestDto dto)
        {
            try
            {
                var created = await _service.CreateAsync(dto);

                return CreatedAtAction(
                    nameof(GetById),
                    new { id = created.Id },
                    ApiResponse<FeeHeadResponseDto>.Ok(created, "Fee head created successfully")
                );
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ApiResponse<FeeHeadResponseDto>.Fail(ex.Message));
            }
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] FeeHeadRequestDto dto)
        {
            try
            {
                var updated = await _service.UpdateAsync(id, dto);

                if (updated == null)
                    return NotFound(ApiResponse<FeeHeadResponseDto>.Fail("Fee head not found"));

                return Ok(ApiResponse<FeeHeadResponseDto>.Ok(updated, "Fee head updated successfully"));
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ApiResponse<FeeHeadResponseDto>.Fail(ex.Message));
            }
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _service.DeleteAsync(id);

            if (!deleted)
                return NotFound(ApiResponse<bool>.Fail("Fee head not found"));

            return Ok(ApiResponse<bool>.Ok(true, "Fee head deleted successfully"));
        }
    }
}