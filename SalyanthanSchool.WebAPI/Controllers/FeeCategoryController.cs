using Microsoft.AspNetCore.Mvc;
using SalyanthanSchool.Core.DTOs.Account.FeeCategory;
using SalyanthanSchool.Core.DTOs.Common;
using SalyanthanSchool.Core.DTOs.FeeCategory;
using SalyanthanSchool.Core.DTOs.FeeCategory.SalyanthanSchool.Core.DTOs.Account.FeeCategory;
using SalyanthanSchool.Core.Interfaces;

namespace SalyanthanSchool.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FeeCategoryController : ControllerBase
    {
        private readonly IFeeCategoryService _service;

        public FeeCategoryController(IFeeCategoryService service)
        {
            _service = service;
        }

        // GET: api/feecategory
        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] FeeCategoryQueryParameter query)
        {
            var result = await _service.GetAllAsync(query);

            return Ok(ApiResponse<IEnumerable<FeeCategoryResponseDto>>.Ok(
                data: result.Items,
                message: "Fee categories fetched successfully",
                meta: new
                {
                    query.PageNumber,
                    query.PageSize,
                    total = result.TotalCount,
                }
            ));
        }

        // GET: api/feecategory/{id}
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var category = await _service.GetByIdAsync(id);

            if (category == null)
                return NotFound(ApiResponse<FeeCategoryResponseDto>.Fail("Fee category not found"));

            return Ok(ApiResponse<FeeCategoryResponseDto>.Ok(
                category,
                "Fee category fetched successfully"
            ));
        }

        // POST: api/feecategory
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] FeeCategoryRequestDto dto)
        {
            try
            {
                var created = await _service.CreateAsync(dto);

                return CreatedAtAction(
                    nameof(GetById),
                    new { id = created.Id },
                    ApiResponse<FeeCategoryResponseDto>.Ok(created, "Fee category created successfully")
                );
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ApiResponse<FeeCategoryResponseDto>.Fail(ex.Message));
            }
        }

        // PUT: api/feecategory/{id}
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] FeeCategoryRequestDto dto)
        {
            try
            {
                var updated = await _service.UpdateAsync(id, dto);

                if (updated == null)
                    return NotFound(ApiResponse<FeeCategoryResponseDto>.Fail("Fee category not found"));

                return Ok(ApiResponse<FeeCategoryResponseDto>.Ok(updated, "Fee category updated successfully"));
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ApiResponse<FeeCategoryResponseDto>.Fail(ex.Message));
            }
        }

        // DELETE: api/feecategory/{id}
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _service.DeleteAsync(id);

            if (!deleted)
                return NotFound(ApiResponse<bool>.Fail("Fee category not found"));

            return Ok(ApiResponse<bool>.Ok(true, "Fee category deleted successfully"));
        }
    }
}